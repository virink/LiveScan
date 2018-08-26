module.exports = {
    title: "存活探測",
    success: "获取成功",
    error: "获取失败",
    status: {
        "live": "存活",
        "dead": "失联"
    },
    move: {
        "null": "请选择数据",
        success: (num) => {
            return `成功清理 ${num}数据!`;
        },
        error: (err) => {
            return `清理数据失败!\n${err}`;
        }
    },
    trash: {
        success: "清空 [.Trash]成功!",
        error: "清空 [.Trash] 失败"
    },
    layout: {
        start: "开始探测",
        stop: "停止探测",
        trash: "移到 [.Trash]",
        cleartrash: "清空 [.Trash]",
        trashdead: "移动失联Shell 到 [.Trash]"
    },
    cella: {
        title: "探测结果",
        grid: {
            shell: "Webshell",
            status: "状态",
            id: "ID",
        }
    }
}