export class MessageFormatterService {
  constructor() {}

  formatter(message: string) {
    const date = new Date();
    return `[${date.toLocaleDateString('us-US', { hour12: false }).replaceAll('/', '-')} ${date.toLocaleTimeString('us-US', { hour12: false })}] ${message}`;
  }
}
