import {
    Message,
    MessageActionRow,
    MessageActionRowOptions,
    MessageEmbed,
    TextBasedChannels,
    TextChannel,
} from "discord.js";
import * as Utils from "../common/Utils";
import { PaginatedInteractor } from "./messaging/Pagination";
import * as Views from "./ViewExporter";

export class Messenger {
    private pastMessages: Promise<Message>[] = [];
    public shouldBeSilent = false;
    constructor(private to: TextBasedChannels | Message) {}

    public send(
        embedOrEmbedsOrString: string | MessageEmbed | MessageEmbed[],
        componentOrComponents?:
            | (MessageActionRow | MessageActionRowOptions)
            | (MessageActionRow | MessageActionRowOptions)[]
    ) {
        if (this.shouldBeSilent) return;

        let embeds;
        if (embedOrEmbedsOrString instanceof Array) {
            embeds = embedOrEmbedsOrString;
        } else if (typeof embedOrEmbedsOrString === "string") {
            embeds = [Views.textView(embedOrEmbedsOrString)];
        } else {
            embeds = [embedOrEmbedsOrString];
        }

        let components;
        if (componentOrComponents === undefined)
            components = componentOrComponents;
        else if (componentOrComponents instanceof Array) {
            components = componentOrComponents;
        } else {
            components = [componentOrComponents];
        }

        if (this.to instanceof Message) {
            const msg = this.to.reply({ embeds, components });
            this.pastMessages.push(msg);
            return msg;
        } else {
            const msg = this.to.send({ embeds, components });
            this.pastMessages.push(msg);
            return msg;
        }
    }
    public paginate(pages: MessageEmbed[]) {
        if (this.shouldBeSilent) return;

        if (this.to instanceof TextChannel)
            this.pastMessages.push(
                new PaginatedInteractor(this.to, pages).paginate()
            );
        else throw new Error("Cannot paginate in a reply");
    }

    public sendTyping() {
        if (this.shouldBeSilent) return;
        if (this.to instanceof TextChannel) this.to.sendTyping();
    }

    public async clean(musicCommandRecognizer: (content: string) => boolean) {
        if (this.to instanceof TextChannel) {
            const pastMessages = await this.to.messages.fetch({ limit: 100 });
            for (const pastMsg of pastMessages.values()) {
                if (
                    this.to.client.user?.id === pastMsg.member?.id ||
                    pastMsg.content === Utils.prefixify("ping") ||
                    musicCommandRecognizer(pastMsg.content)
                ) {
                    if (pastMsg.deletable) {
                        setTimeout(() => pastMsg.delete().catch(), 1000);
                    }
                }
            }
        }
    }
}

export const __FOR__TESTING__ = {};
