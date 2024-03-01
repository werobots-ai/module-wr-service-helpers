const DAPR_HTTP_PORT = process.env.DAPR_HTTP_PORT || 3500;

export const getDaprUrl = (serviceName: string, path: string) => {
  return `http://localhost:${DAPR_HTTP_PORT}/v1.0/invoke/${serviceName}/method${
    path[0] === "/" ? "" : "/"
  }${path}`;
};
