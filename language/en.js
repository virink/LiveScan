module.exports = {
    title: "LiveScan",
    success: "Success",
    error: "Failed",
    status: {
        "live": "Live",
        "dead": "Dead"
    },
    move: {
        "null": "Plz choose items",
        success: (num) => {
            return `Move ${num}datas success!`;
        },
        error: (err) => {
            return `Move data failed!\n${err}`;
        }
    },
    trash: {
        success: "Clear [.Trash] Success!",
        error: "Failed to clear [.Trash]"
    },
    layout: {
        start: "Start",
        stop: "Stop",
        trash: "Move selected to [.Trash]",
        cleartrash: "Clear All [.Trash]",
        trashdead: "Move All Dead to [.Trash]"
    },
    cella: {
        title: "Results",
        grid: {
            shell: "Webshell",
            status: "Status",
            id: "ID"
        }
    }
}