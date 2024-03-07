import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(
    `API Error:`,
    {
      path: req.path,
      method: req.method,
      body: req.body,
    },
    err
  );

  if (err.status || err.statusCode) {
    res.status(err.status || err.statusCode).send(err.message);
    return;
  }

  if (err.message.toLowerCase().includes("not found")) {
    res.status(404).send(err.message);
    return;
  }

  if (err.message.toLowerCase().includes("unauthorized")) {
    res.status(401).send(err.message);
    return;
  }

  if (err.message.toLowerCase().includes("forbidden")) {
    res.status(403).send(err.message);
    return;
  }

  res.status(500).send("Internal Server Error");
};
