/**
 * 核心扫描模块
 */

class Scanner {

  constructor(opt, argv) {
    return new Promise((res, rej) => {
      this.shells = argv.shells;
      this.liveScan(res, rej);
    });
  }

  liveScan(res, rej) {
    let _promises = [];
    this.shells.map((shell) => {

      let core = new antSword['core'][shell['type']](shell);
      let _randstr = this.randstr;

      _promises.push(
        core.request({
          _: this.template[shell['type']](_randstr)
        })
        .then((ret) => {
          return {
            id: shell["_id"],
            status: ret.text === _randstr,
            shell: shell.url
          };
        })
        .catch((err) => {
          return {
            id: shell["_id"],
            status: false,
            shell: shell.url
          };
        })
      );
    });

    Promise.all(_promises).then((results) => {
      return res(results);
    }).catch((err) => {
      return rej(err);
    });
  }


  get randstr() {
    var x = "0123456789qwertyuioplkjhgfdsazxcvbnm";
    var tmp = "";
    var timestamp = new Date().getTime();
    for (var i = 0; i < 20; i++) {
      tmp += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
    }
    return tmp;
  }

  /**
   * 扫描代码函数
   * @return {[type]}      [description]
   */
  get template() {
    return {
      php: (str) => `echo "${str}";`,
      asp: (str) => `response.write "${str}"`,
      aspx: (str) => `Response.Write('${str}');`
      // jsp: (str) => `"${str}";`
    }
  }
}

module.exports = Scanner;