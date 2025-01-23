export interface MessageListener {
  listen(): Promise<void>;
}
