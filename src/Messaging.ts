import {
    Message,
    MessageActionRow,
    MessageActionRowOptions,
    MessageComponentInteraction,
    MessageEmbed,
    TextBasedChannels,
    TextChannel,
} from "discord.js";
import { mod } from "./Utils";
import { textView } from "./Views";

export class Messenger {
    private pastMessages: Promise<Message>[] = [];
    private shouldBeSilent = false;
    constructor(private to: TextBasedChannels | Message) {}

    public send(
        embedOrEmbedsOrString: string | MessageEmbed | MessageEmbed[],
        componentOrComponents?:
            | (MessageActionRow | MessageActionRowOptions)
            | (MessageActionRow | MessageActionRowOptions)[]
    ): Promise<Message> {
        let embeds;
        if (embedOrEmbedsOrString instanceof Array) {
            embeds = embedOrEmbedsOrString;
        } else if (typeof embedOrEmbedsOrString === "string") {
            embeds = [textView(embedOrEmbedsOrString)];
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
        if (this.to instanceof TextChannel)
            new PaginatedInteractor(this.to, pages).paginate();
        else throw new Error("Cannot paginate in a reply");
    }

    public toggleSilence() {
        this.shouldBeSilent = !this.shouldBeSilent;
    }

    public sendTyping() {
        if (this.to instanceof TextChannel) this.to.sendTyping();
    }
}

export class PaginatedInteractor {
    private currentPage = 0;

    constructor(private to: TextBasedChannels, private pages: MessageEmbed[]) {}

    async paginate() {
        const msg = await this.to.send({
            embeds: [this.pages[this.currentPage]],
            components: [
                {
                    type: "ACTION_ROW",
                    components: [
                        {
                            type: "BUTTON",
                            style: "PRIMARY",
                            label: "First",
                            emoji: "⏮️",
                            customId: "⏮️",
                        },
                        {
                            type: "BUTTON",
                            style: "PRIMARY",
                            label: "Prev",
                            emoji: "◀️",
                            customId: "◀️",
                        },
                        {
                            type: "BUTTON",
                            style: "PRIMARY",
                            label: "Next",
                            emoji: "▶️",
                            customId: "▶️",
                        },
                        {
                            type: "BUTTON",
                            style: "PRIMARY",
                            label: "Last",
                            emoji: "⏭️",
                            customId: "⏭️",
                        },
                    ],
                },
            ],
        });

        const collector = msg.createMessageComponentCollector({
            max: this.pages.length * 5,
        });

        setTimeout(() => {
            collector.stop("Timeout");
            msg.edit({ components: [] });
        }, 150_000);

        collector.on("collect", async (interaction) => {
            const { customId } = interaction;
            switch (customId) {
                case "⏮️":
                    this.currentPage = 0;
                    this.update(interaction);
                    break;
                case "◀️":
                    this.currentPage = mod(
                        this.currentPage - 1,
                        this.pages.length
                    );
                    this.update(interaction);
                    break;
                case "▶️":
                    this.currentPage = mod(
                        this.currentPage + 1,
                        this.pages.length
                    );
                    this.update(interaction);
                    break;
                case "⏭️":
                    this.currentPage = this.pages.length - 1;
                    this.update(interaction);
                    break;
            }
        });
    }

    private async update(interaction: MessageComponentInteraction) {
        await interaction.update({
            embeds: [
                this.pages[this.currentPage].setFooter(
                    `Page ${this.currentPage + 1} of ${this.pages.length}`
                ),
            ],
        });
    }
}
