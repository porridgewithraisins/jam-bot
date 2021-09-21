import * as discordJs from "discord.js";
import * as Utils from "../../common/Utils";

export class PaginatedInteractor {
    private currentPage = 0;

    constructor(
        private to: discordJs.TextBasedChannels,
        private pages: discordJs.MessageEmbed[]
    ) {}

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
            this.currentPage = 0;
            msg.edit({
                embeds: [this.pages[this.currentPage]],
                components: [],
            });
        }, 150_000);

        collector.on("collect", async (interaction) => {
            const { customId } = interaction;
            switch (customId) {
                case "⏮️":
                    this.currentPage = 0;
                    this.update(interaction);
                    break;
                case "◀️":
                    this.currentPage = Utils.mod(
                        this.currentPage - 1,
                        this.pages.length
                    );
                    this.update(interaction);
                    break;
                case "▶️":
                    this.currentPage = Utils.mod(
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
        return msg;
    }

    private async update(interaction: discordJs.MessageComponentInteraction) {
        await interaction.update({
            embeds: [
                this.pages[this.currentPage].setFooter(
                    `Page ${this.currentPage + 1} of ${this.pages.length}`
                ),
            ],
        });
    }
}
