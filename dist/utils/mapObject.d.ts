import { FieldMappingRule, FieldSource } from "../types/WorkspacePreset";
export declare const getSourceValue: (source: Record<string, any>, sourceConfig: FieldSource) => any;
export declare const mapObject: (source: Record<string, any>, rules: FieldMappingRule[]) => Record<string, any>;
