const Stash = require("../../bin/services/Stash").__FOR__TESTING__;

describe("queue stashing service", () => {
    expect(Stash.init()).toBeTruthy();
    const mock1 = [
        {
            title: "Ek Tarfa - Reprise",
            url: "https://www.youtube.com/watch?v=sYicH8hUI-I&list=PL0dTqopwxGzRqAtF5bSwPxGJReVtLqHP_&index=2",
            duration: "4:02",
            thumbnail:
                "https://i.ytimg.com/vi/sYicH8hUI-I/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAyqdXazHgjHEQH8zV1WZUZZ6mr0w",
            artist: "DarshanRavalDZ",
        },
        {
            title: "Love Is Gone (Acoustic)",
            url: "https://www.youtube.com/watch?v=HiXx5JFRxb4&list=PL0dTqopwxGzRqAtF5bSwPxGJReVtLqHP_&index=3",
            duration: "2:57",
            thumbnail:
                "https://i.ytimg.com/vi/HiXx5JFRxb4/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLCbJFnO17Tm1y0XNCQSp_e3zxMvkg",
            artist: "SLANDER",
        },
        {
            title: "Back to Your Heart",
            url: "https://www.youtube.com/watch?v=gXvDKt0swnU&list=PL0dTqopwxGzRqAtF5bSwPxGJReVtLqHP_&index=4",
            duration: "4:22",
            thumbnail:
                "https://i.ytimg.com/vi/gXvDKt0swnU/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLCCC_dycXXZm0_Iw1vdYnjPI12FpQ",
            artist: "Backstreet Boys",
        },
        {
            title: "Sunn Raha Hai",
            url: "https://www.youtube.com/watch?v=lOBmToX9gr8&list=PL0dTqopwxGzRqAtF5bSwPxGJReVtLqHP_&index=8",
            duration: "6:31",
            thumbnail:
                "https://i.ytimg.com/vi/lOBmToX9gr8/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLASKh2dqMco8aw6YVrv4gx1xdrfFw",
            artist: "Ankit Tiwari",
        },
        {
            title: "I Like Me Better",
            url: "https://www.youtube.com/watch?v=gd9tsqCu3MQ&list=PL0dTqopwxGzRqAtF5bSwPxGJReVtLqHP_&index=9",
            duration: "3:18",
            thumbnail:
                "https://i.ytimg.com/vi/gd9tsqCu3MQ/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLCsmWHoZa5cWpUDhyrjbuI5iHepXg",
            artist: "Lauv",
        },
        {
            title: "Youngblood",
            url: "https://www.youtube.com/watch?v=CXNv4_wQjKQ&list=PL0dTqopwxGzRqAtF5bSwPxGJReVtLqHP_&index=10",
            duration: "3:24",
            thumbnail:
                "https://i.ytimg.com/vi/CXNv4_wQjKQ/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLBY7tduuhkDjyCns8BWMxIIaqi9Ig",
            artist: "5SOS",
        },
        {
            title: "Julia",
            url: "https://www.youtube.com/watch?v=rmdbVLgMm9Q&list=PL0dTqopwxGzRqAtF5bSwPxGJReVtLqHP_&index=11",
            duration: "3:38",
            thumbnail:
                "https://i.ytimg.com/vi/rmdbVLgMm9Q/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAIHf5Sln5a5EZLRwnjd8XbxnhHDg",
            artist: "Lauv",
        },
        {
            title: "Me And My Broken Heart",
            url: "https://www.youtube.com/watch?v=ooE8Og_tWgk&list=PL0dTqopwxGzRqAtF5bSwPxGJReVtLqHP_&index=12",
            duration: "3:14",
            thumbnail:
                "https://i.ytimg.com/vi/ooE8Og_tWgk/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLBiF4mkL_E_heTJNdNvlctSkzA_zw",
            artist: "push baby - Topic",
        },
        {
            title: "Wolves",
            url: "https://www.youtube.com/watch?v=3ZJ1PkZt3M8&list=PL0dTqopwxGzRqAtF5bSwPxGJReVtLqHP_&index=13",
            duration: "3:18",
            thumbnail:
                "https://i.ytimg.com/vi/3ZJ1PkZt3M8/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLC5QR_xKDcqQOApwHzs9PAJjRKErA",
            artist: "Selena Gomez",
        },
    ];

    const mock2 = [
        {
            title: "Pompeii",
            url: "https://www.youtube.com/watch?v=_kmgAqiF4Sg&list=PL0dTqopwxGzRqAtF5bSwPxGJReVtLqHP_&index=38",
            duration: "3:35",
            thumbnail:
                "https://i.ytimg.com/vi/_kmgAqiF4Sg/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDXQDlx3sE-IK6mmN2X31NfW8sf_w",
            artist: "BASTILLEvideos",
        },
        {
            title: "Shape of My Heart",
            url: "https://www.youtube.com/watch?v=BLhIcQMaaTI&list=PL0dTqopwxGzRqAtF5bSwPxGJReVtLqHP_&index=39",
            duration: "3:51",
            thumbnail:
                "https://i.ytimg.com/vi/BLhIcQMaaTI/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLCqorJUqHZN2PpbN7dLfC3kM3HNpg",
            artist: "Backstreet Boys",
        },
        {
            title: "Iridescent",
            url: "https://www.youtube.com/watch?v=ZTmMxG-tI-U&list=PL0dTqopwxGzRqAtF5bSwPxGJReVtLqHP_&index=40",
            duration: "4:57",
            thumbnail:
                "https://i.ytimg.com/vi/ZTmMxG-tI-U/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLBR4hUGkszhvKS8_c5P7TgIln2ySQ",
            artist: "Linkin Park",
        },
        {
            title: "Marvin Gaye (feat. Meghan Trainor)",
            url: "https://www.youtube.com/watch?v=SA3ZaJaW98w&list=PL0dTqopwxGzRqAtF5bSwPxGJReVtLqHP_&index=41",
            duration: "3:11",
            thumbnail:
                "https://i.ytimg.com/vi/SA3ZaJaW98w/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAn0NGnDEHS35MOXDgpCWs5dlTDAQ",
            artist: "Charlie Puth",
        },
        {
            title: "Mirrors",
            url: "https://www.youtube.com/watch?v=59nAgJZ5IoE&list=PL0dTqopwxGzRqAtF5bSwPxGJReVtLqHP_&index=42",
            duration: "8:05",
            thumbnail:
                "https://i.ytimg.com/vi/59nAgJZ5IoE/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLC6G122mKCjADL9JtqDaWtH4WxJCg",
            artist: "Justin Timberlake",
        },
        {
            title: "Helpless When She Smiles (Radio Version)",
            url: "https://www.youtube.com/watch?v=AHIaW8fPGCE&list=PL0dTqopwxGzRqAtF5bSwPxGJReVtLqHP_&index=43",
            duration: "4:06",
            thumbnail:
                "https://i.ytimg.com/vi/AHIaW8fPGCE/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDMJva61wfJoXghbUTdZ0aQc8CpUw",
            artist: "Backstreet Boys",
        },
    ];

    it("retrieve pushed queue intact", async () => {
        await Stash.push("mockGuild12345", "mockQueue", mock1);
        const retrieved = await Stash.pop("mockGuild12345", "mockQueue");
        expect(retrieved).toStrictEqual(mock1);
    });

    it("view one queue without modifying", async () => {
        await Stash.push("mockGuild12345", "mockQueue", mock1);
        let toSee = await Stash.view("mockGuild12345", "mockQueue");
        expect(toSee).toStrictEqual(mock1);
        toSee = await Stash.view("mockGuild12345", "mockQueue");
        expect(toSee).toBeDefined();
    });

    it("view all queues without modifying", async () => {
        await Stash.push("mockGuild12345", "mockQueue", mock1);
        await Stash.push("mockGuild12345", "mockQueue2", mock2);
        let retrieved = await Stash.view("mockGuild12345");
        expect(retrieved).toStrictEqual({
            mockQueue: mock1,
            mockQueue2: mock2,
        });
        retrieved = await Stash.view("mockGuild12345");
        expect(retrieved).toBeDefined();
    });

    it("deletes single queue", async () => {
        await Stash.push("mockGuild12345", "mockQueue", mock1);
        await Stash.drop("mockGuild12345", "mockQueue");
        const retrieved = await Stash.pop("mockGuild12345", "mockQueue");
        expect(retrieved).toBeUndefined();
    });

    it("deletes all queues", async () => {
        await Stash.push("mockGuild12345", "mockQueue", mock1);
        await Stash.push("mockGuild12345", "mockQueue2", mock2);
        await Stash.drop("mockGuild12345");
        const retrieved = await Stash.view("mockGuild12345");
        expect(retrieved).toStrictEqual({});
    });
});

describe("stash - filesystem utility functions", () => {
    it("gets filename from guildID correctly", () => {
        expect(Stash.getFileForGuild("298429ghgf8131")).toMatch(
            /^.*298429ghgf8131.json$/
        );
    });
});
