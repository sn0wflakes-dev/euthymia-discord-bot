import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import { env } from "../config/env";
import { log } from "../config/logging";

const PROTO_PATH = path.resolve(__dirname, "./proto/nsfw.proto");

const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const proto = grpc.loadPackageDefinition(packageDef) as any;

let _client: any = null;

export function getNsfwGrpcClient() {
  if (_client) return _client; // singleton — reuse koneksi

  _client = new proto.nsfw.NsfwClassifier(
    env.GRPC_NSFW_URL, // misal: "localhost:50051"
    grpc.credentials.createInsecure()
  );

  log.info(`gRPC NSFW client connected to ${env.GRPC_NSFW_URL}`);
  return _client;
}
