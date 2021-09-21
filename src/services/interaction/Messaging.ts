import * as discordJs from "discord.js";
import * as Utils from "../../common/Utils";
import * as Text from "../../views/Text";
import * as PaginatedInteractor from "./Pagination";

export class Messenger {
    private pastMessages: Promise<discordJs.Message>[] = [];
    public shouldBeSilent = false;
    constructor(private to: discordJs.TextBasedChannels | discordJs.Message) {}

    public send(
        embedOrEmbedsOrString:
            | string
            | discordJs.MessageEmbed
            | discordJs.MessageEmbed[],
        componentOrComponents?:
            | (discordJs.MessageActionRow | discordJs.MessageActionRowOptions)
            | (discordJs.MessageActionRow | discordJs.MessageActionRowOptions)[]
    ) {
        if (this.shouldBeSilent) return;

        let embeds;
        if (embedOrEmbedsOrString instanceof Array) {
            embeds = embedOrEmbedsOrString;
        } else if (typeof embedOrEmbedsOrString === "string") {
            embeds = [Text.view(embedOrEmbedsOrString)];
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

        if (this.to instanceof discordJs.Message) {
            const msg = this.to.reply({ embeds, components });
            this.pastMessages.push(msg);
            return msg;
        } else {
            const msg = this.to.send({ embeds, components });
            this.pastMessages.push(msg);
            return msg;
        }
    }
    public paginate(pages: discordJs.MessageEmbed[]) {
        if (this.shouldBeSilent) return;

        if (this.to instanceof discordJs.TextChannel)
            this.pastMessages.push(
                new PaginatedInteractor.PaginatedInteractor(
                    this.to,
                    pages
                ).paginate()
            );
        else throw new Error("Cannot paginate in a reply");
    }

    public sendTyping() {
        if (this.shouldBeSilent) return;
        if (this.to instanceof discordJs.TextChannel) this.to.sendTyping();
    }

    public async clean(musicCommandRecognizer: (content: string) => boolean) {
        if (this.to instanceof discordJs.TextChannel) {
            const pastMessages = await this.to.messages.fetch({ limit: 30 });
            pastMessages.forEach((message) => {
                if (
                    this.to.client.user?.id === message.member?.id ||
                    message.content === Utils.prefixify("ping") ||
                    musicCommandRecognizer(message.content)
                ) {
                    if (message.deletable) {
                        message
                            .delete()
                            .catch(() =>
                                console.log("Could not delete some messages")
                            );
                    }
                }
            });
        }
    }
}
