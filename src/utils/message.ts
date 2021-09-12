const getArg = (content: string) => content.split(" ").slice(1).join(" ");
const getCmd = (content: string) => content.split(" ")[0];

const removeLinkMarkdown = (content: string) => {
    if (content[0] === "<" && content.at(-1) === ">")
        return content.slice(1, -1);
    return content;
};

export { getArg, getCmd, removeLinkMarkdown };
