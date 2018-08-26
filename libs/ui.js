/**
 * 插件UI框架
 */

const WIN = require('ui/window');
const LANG = require('../language/');

class UI {

  constructor(opt) {
    // 创建一个windows窗口
    this.win = new WIN({
      title: `${LANG['title']}`,
      height: 600,
      width: 800,
    });
    this.gridData = [];
    this.createMainLayout();
    return {
      onScan: (func) => {
        this.bindToolbarClickHandler(func);
      },
      onAbout: () => {}
    }
  }

  /**
   * 创建上下layout:扫描输入&&扫描结果
   * @return {[type]} [description]
   */
  createMainLayout() {
    let layout = this.win.win.attachLayout('1C');
    // ToolBar
    let toolbar = layout.attachToolbar();
    toolbar.loadStruct([{
      id: 'start',
      type: 'button',
      text: LANG['layout']['start'],
      icon: 'play'
    }, {
      id: 'stop',
      type: 'button',
      text: LANG['layout']['stop'],
      icon: 'stop'
    }, {
      type: 'separator'
    }, {
      id: 'trash',
      type: 'button',
      text: LANG['layout']['trash'],
      icon: 'trash'
    }, {
      id: 'trashdead',
      type: 'button',
      text: LANG['layout']['trashdead'],
      icon: 'trash'
    }, {
      id: 'cleartrash',
      type: 'button',
      text: LANG['layout']['cleartrash'],
      icon: 'trash'
    }]);
    // 创建grid
    layout.cells('a').setText(`<i class="fa fa-cogs"></i> ${LANG['cella']['title']}`);
    this.createGrid(layout.cells('a'));

    this.toolbar = toolbar;
    this.layout = layout;
  }

  /**
   * 创建扫描结果表格
   * @param  {Object} cell [description]
   * @return {[type]}      [description]
   */
  createGrid(cell) {
    let grid = cell.attachGrid();
    grid.setHeader(`
      ${LANG['cella']['grid']['id']},
      ${LANG['cella']['grid']['shell']},
      ${LANG['cella']['grid']['status']},
      ${LANG['cella']['grid']['id']}
    `);
    grid.setColTypes("ro,ro,ro,ro");
    grid.setColSorting('str,str,str,str');
    // grid.setColumnIds("id,shell,status,_id");
    grid.setInitWidths("100,*,100,*");
    grid.setColAlign("center,left,center,center");
    grid.setColumnHidden(3, true);
    grid.enableMultiselect(true);
    grid.init();

    this.grid = grid;

    window.test = {
      grid: this.grid
    }
  }

  /**
   * 监听开始按钮点击事件
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  bindToolbarClickHandler(callback) {
    this.toolbar.attachEvent('onClick', (id) => {
      switch (id) {
        case 'trashdead':
          let _ids = []
          this.gridData.map((row) => {
            if (row.status === false) {
              _ids.push(row.id)
            }
          });
        case 'trash':
          let ids = [];
          if (id === 'trashdead')
            ids = _ids;
          else
            ids = (this.grid.getSelectedId() || '').split(',');
          if (ids == "" || ids[0] == "") {
            // console.debug(ids);
            toastr.error(LANG['move']['null'], LANG['error']);
            break
          }
          var ret = antSword['ipcRenderer'].sendSync('shell-move', {
            ids: ids,
            category: '.Trash'
          });
          // console.debug(ret);
          if (typeof(ret) === 'number') {
            toastr.success(LANG['move']['success'](ret), LANG['success']);
            antSword.modules.shellmanager.reloadData();
            antSword.modules.shellmanager.category.sidebar.callEvent('onSelect', [".Trash"]);
          } else {
            toastr.error(LANG['move']['error'](ret), LANG['error']);
          }
          this.grid.clearAll();
          break;
        case 'stop':
          // TODO ?
          break;
        case 'cleartrash':
          var ret = antSword['ipcRenderer'].sendSync('shell-clear', '.Trash');
          // console.debug(ret);
          if (typeof(ret) === 'number') {
            toastr.success(LANG['trash']['success'], LANG['success']);
            antSword.modules.shellmanager.reloadData();
            antSword.modules.shellmanager.category.sidebar.callEvent('onSelect', ["default"]);
            antSword.modules.shellmanager.category.sidebar.items('.Trash').remove();
            setTimeout(antSword.modules.shellmanager.category.updateHeader.bind(antSword.modules.shellmanager.category), 200);
          } else {
            toastr.error(LANG['trash']['error'], LANG['error']);
          }
          break;
        case 'start':
          // 开始扫描
          this.win.win.progressOn();
          // 获取 Shell
          let shells = antSword['ipcRenderer'].sendSync('shell-find', {
            "type": {
              "$nin": ["custom"]
            },
            "category": {
              "$nin": [".Trash"]
            }
          });
          // 传递给扫描核心代码
          callback({
              shells: shells
            }).then((ret) => {
              // 解析扫描结果
              let griddata = [];
              this.gridData = ret;
              ret.map((item, i) => {
                // console.debug(i, item);
                if (!item) {
                  return
                };
                griddata.push({
                  id: item.id,
                  data: [i, item.shell, LANG['status'][item.status ? "live" : "dead"], item.id]
                });
              });
              // 渲染UI
              this.grid.clearAll();
              this.grid.parse({
                rows: griddata
              }, "json");

              toastr.success(LANG['success'], antSword['language']['toastr']['success']);
              // 取消锁定LOADING
              this.win.win.progressOff();
            })
            .catch((err) => {
              // console.debug(err);
              toastr.error(LANG['error'], antSword['language']['toastr']['error']);
              this.win.win.progressOff();
            });
          break;
        default:
      }
    })
  }
}

module.exports = UI;