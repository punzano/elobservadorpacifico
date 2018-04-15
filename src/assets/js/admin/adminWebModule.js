let AdminWebModule = function() {
  let router_module = new RouterModule();

  this.init = function() {
    $(document).foundation();
    router_module.init();
  }
}
