export interface Node {
  type: "element" | "text";
  name?: string;
  attributes: Record<string, string>;
  children?: Node[];
  text?: string;
}

type OutputFn = (chunk: string) => void;
type XmlReplacerFn = (root: Node) => Promise<string>;

export class XmlStreamReplacer {
  private mode: "NORMAL" | "CAPTURE" = "NORMAL";
  private stack: Node[] = [];
  private buffer = "";
  private currentText = "";
  private depth = 0;

  private locked = false;
  private chunkQueue: string[] = [];

  constructor(
    private output: OutputFn,
    private xmlReplacer: XmlReplacerFn,
    private validTags: Set<string>
  ) {}

  public async processChunk(chunk: string) {
    this.chunkQueue.push(chunk);
    if (this.locked) return;

    this.locked = true;
    try {
      while (this.chunkQueue.length) {
        const nextChunk = this.chunkQueue.shift()!;
        if (nextChunk && typeof nextChunk !== "string") {
          // pass through non-string chunks
          this.output(nextChunk);
          continue;
        }

        for (const char of nextChunk) {
          // We must await processChar, so we don’t race ahead.
          await this.processChar(char);
        }
      }
    } finally {
      this.locked = false;
    }
  }

  private async processChar(char: string) {
    if (this.mode === "NORMAL") {
      this.handleNormalChar(char);
      return;
    }
    await this.handleCaptureChar(char);
  }

  // --- NORMAL MODE ---

  private handleNormalChar(char: string) {
    if (char !== "<") {
      this.output(char);
      return;
    }
    this.startCapture(char);
  }

  // --- CAPTURE MODE ---

  private async handleCaptureChar(char: string) {
    this.buffer += char;
    if (!this.couldStillBeTag(this.buffer)) {
      this.fallbackToText(this.buffer);
      this.buffer = "";
      return;
    }
    if (char === ">") {
      await this.processTagToken(this.buffer);
      this.buffer = "";
    }
  }

  private startCapture(firstChar: string) {
    this.mode = "CAPTURE";
    this.stack = [];
    this.depth = 0;
    this.buffer = firstChar;
    this.currentText = "";
  }

  // We make processTagToken async so we can await the entire handling.
  private async processTagToken(tag: string) {
    if (tag.startsWith("</")) {
      await this.handleCloseTag(tag);
      return;
    }
    await this.handleOpenTagOrFallback(tag);
  }

  private async handleOpenTagOrFallback(tag: string) {
    const isValid = this.isPotentialOpenTag(tag);
    if (!isValid) {
      this.fallbackToText(tag);
      return;
    }
    await this.openTag(tag);
  }

  private isPotentialOpenTag(tag: string): boolean {
    const match = tag.match(/^<([\w-]+)(.*?)\/?>$/);
    if (!match) return false;
    const tagName = match[1];
    return this.validTags.has(tagName);
  }

  private fallbackToText(tag: string) {
    this.output(tag);
    this.mode = "NORMAL";
    this.stack = [];
    this.depth = 0;
    this.currentText = "";
  }

  // Make openTag async so we can await completeCapture if it’s self-closing & top-level.
  private async openTag(tag: string) {
    this.flushText();
    const isSelfClose = tag.endsWith("/>");
    const { name, attributes } = this.parseOpenTag(tag);
    const node: Node = { type: "element", name, attributes, children: [] };

    if (!isSelfClose) {
      this.stack.push(node);
      this.depth++;
      return;
    }
    this.addNode(node);
    if (this.depth !== 0) return;
    await this.completeCapture();
  }

  private parseOpenTag(tag: string) {
    const match = tag.match(/^<([\w-]+)(.*?)\/?>$/)!;
    const [, name, attrStr] = match;
    const attributes = this.parseAttributes(attrStr);
    return { name, attributes };
  }

  // Closing tags were already awaited, but we keep it short & consistent.
  private async handleCloseTag(tag: string) {
    this.flushText();
    const closingName = this.parseCloseTagName(tag);
    const node = this.stack.pop();
    this.depth--;

    if (!node || node.name !== closingName) {
      throw new Error(`Tag mismatch. Expected </${node?.name}> but got ${tag}`);
    }
    this.addNode(node);

    if (this.depth === 0) {
      await this.completeCapture();
    }
  }

  private parseCloseTagName(tag: string): string {
    const match = tag.match(/^<\/([\w-]+)\s*>$/);
    if (!match) throw new Error(`Invalid closing tag: ${tag}`);
    return match[1];
  }

  private addNode(node: Node) {
    if (this.stack.length > 0) {
      const parent = this.stack[this.stack.length - 1];
      parent.children!.push(node);
      return;
    }
    this.stack.push(node);
  }

  private flushText() {
    if (!this.currentText) return;
    const textNode: Node = {
      type: "text",
      text: this.currentText,
      attributes: {},
    };
    this.addNode(textNode);
    this.currentText = "";
  }

  private async completeCapture() {
    const completeNodes = [...this.stack];
    this.stack = [];
    this.mode = "NORMAL";

    const replacedChunks = await Promise.all(
      completeNodes.map((node) => this.xmlReplacer(node))
    );
    const replaced = replacedChunks.join("");
    this.output(replaced);
  }

  private parseAttributes(attrStr: string): Record<string, string> {
    const attrs: Record<string, string> = {};
    const pattern = /([\w-]+)\s*=\s*("([^"]*)"|'([^']*)')|([\w-]+)/g;
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(attrStr)) !== null) {
      const [, key1, , valDbl, valSgl, key2] = match;
      if (key1) {
        attrs[key1] = valDbl ?? valSgl ?? "";
        continue;
      }
      attrs[key2] = "";
    }
    return attrs;
  }

  public flushRawText(chunk: string) {
    if (this.mode === "NORMAL") {
      this.output(chunk);
      return;
    }
    this.currentText += chunk;
  }

  private couldStillBeTag(buffer: string) {
    if (buffer === "<" || buffer === "</") return true;
    if (!buffer.startsWith("<")) return false;
    const partialRegex = /^<\/?[a-zA-Z0-9-]+(\s.*)?$/;
    return partialRegex.test(buffer);
  }
}

export async function replaceXmlInString(
  input: string,
  xmlReplacer: XmlReplacerFn,
  validTags: Set<string>
): Promise<string> {
  const outputChunks: string[] = [];
  const output: OutputFn = (chunk) => outputChunks.push(chunk);

  const replacer = new XmlStreamReplacer(output, xmlReplacer, validTags);
  await replacer.processChunk(input);

  return outputChunks.join("");
}
