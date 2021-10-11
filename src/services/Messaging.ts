import {
    Message,
    MessageActionRow,
    MessageActionRowOptions,
    MessageEmbed,
    TextChannel,
} from "discord.js";
import { configObj } from "../common/Config";
import * as Utils from "../common/Utils";
import { makeEphemeral } from "./messaging/Ephemeral.Messaging";
import { PaginatedInteractor } from "./messaging/Pagination.Messaging";
import * as Views from "../views/ViewExporter";

export class Messenger<T extends Message | TextChannel> {
    public shouldBeSilent = false;
    constructor(public to: T) {}

    public send(
        embedOrEmbedsOrString: string | MessageEmbed | MessageEmbed[],
        componentOrComponents?:
            | (MessageActionRow | MessageActionRowOptions)
            | (MessageActionRow | MessageActionRowOptions)[],
        ephemeral?: { disappearAfter: number }
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

        const msg =
            this.to instanceof Message
                ? this.to.reply({ embeds, components })
                : this.to.send({ embeds, components });

        if (ephemeral?.disappearAfter)
            makeEphemeral(msg, ephemeral.disappearAfter);
        else if (configObj.autoDeleteAfter)
            makeEphemeral(msg, configObj.autoDeleteAfter * 1000);

        return msg;
    }

    public paginate(pages: MessageEmbed[]) {
        if (this.shouldBeSilent) return;

        if (this.to instanceof TextChannel)
            new PaginatedInteractor(this.to, pages).paginate();
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
                        setTimeout(
                            () => pastMsg.delete().catch((_e) => {}),
                            1000
                        );
                    }
                }
            }
        }
    }
}

export const __FOR__TESTING__ = {};
