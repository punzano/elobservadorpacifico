page("/", function(context, next) {
  page.redirect("/ultimas-entradas");
});

page("/ultimas-entradas", function(context, next) {
  setActiveOption(context.path);
  loadLastEntries();
});

page("/reflexiones", function(context, next) {
  setActiveOption(context.path);
  loadCategoryEntries(context.path);
});

page("/directos", function(context, next) {
  setActiveOption(context.path);
  loadCategoryEntries(context.path);
});

page("/peliculas-con-mensaje", function(context, next) {
  setActiveOption(context.path);
  loadCategoryEntries(context.path);
});

page("/aprendamos-meditacion-y-relajacion", function(context, next) {
  setActiveOption(context.path);
  loadCategoryEntries(context.path);
});

page("/espiritualidad-y-autoconocimiento-libres-curiosidades", function(context, next) {
  setActiveOption(context.path);
  loadCategoryEntries(context.path);
});

page("/bibliografia-y-grandes-maestros", function(context, next) {
  setActiveOption(context.path);
  loadCategoryEntries(context.path);
});

page("/deporte-consciente", function(context, next) {
  setActiveOption(context.path);
  loadCategoryEntries(context.path);
});

page("/habilidades-y-talentos-a-desarrollar-coaching", function(context, next) {
  setActiveOption(context.path);
  loadCategoryEntries(context.path);
});

page("/amar-desde-nuestro-zentro-y-relaciones-sociales-sanas", function(context, next) {
  setActiveOption(context.path);
  loadCategoryEntries(context.path);
});

page("/mecanismos-y-creencias-limitantes-del-ego-e-inteligencia-emocional", function(context, next) {
  setActiveOption(context.path);
  loadCategoryEntries(context.path);
});

page("/reconciliacion-e-integracion-con-la-familia-y-raices", function(context, next) {
  setActiveOption(context.path);
  loadCategoryEntries(context.path);
});

page("/ciencia-e-investigacion", function(context, next) {
  setActiveOption(context.path);
  loadCategoryEntries(context.path);
});

page("/audios-guiados-y-meditaciones", function(context, next) {
  setActiveOption(context.path);
  loadCategoryEntries(context.path);
});

page("/about_me", function(context, next) {
  setActiveOption(context.path);
  loadHtml(context.path);
});

page("/contact", function(context, next) {
  setActiveOption(context.path);
  loadHtml(context.path);
});

page();
