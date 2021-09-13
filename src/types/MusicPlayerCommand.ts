export interface MusicPlayerCommand {
    description ?: string;
    triggers: string[];
    handler: (arg: string) => Promise<void>;
}
export interface MusicPlayerCommandMap {
    [name: string]: MusicPlayerCommand;
}
