page("/", function(context, next) {
  page.redirect("/ultimas-entradas");
});

page("/ultimas-entradas", function(context, next) {
  loadCategories();
  setActiveOption(context.path);
  loadLastEntries();
});

// page("/reflexiones", function(context, next) {
//   setActiveOption(context.path);
//   loadCategoryEntries("Reflexiones");
// });
//
// page("/directos", function(context, next) {
//   setActiveOption(context.path);
//   loadCategoryEntries("Directos");
// });
//
// page("/peliculas-con-mensaje", function(context, next) {
//   setActiveOption(context.path);
//   loadCategoryEntries("Películas con Mensaje");
// });
//
// page("/aprendamos-meditacion-y-relajacion", function(context, next) {
//   setActiveOption(context.path);
//   loadCategoryEntries("Aprendamos Meditación y Relajación");
// });
//
// page("/espiritualidad-y-autoconocimiento-libres-curiosidades", function(context, next) {
//   setActiveOption(context.path);
//   loadCategoryEntries("Espiritualidad y Autoconocimiento Libres, Curiosidades...");
// });
//
// page("/bibliografia-y-grandes-maestros", function(context, next) {
//   setActiveOption(context.path);
//   loadCategoryEntries("Bibliografía y Grandes Maestros");
// });
//
// page("/deporte-consciente", function(context, next) {
//   setActiveOption(context.path);
//   loadCategoryEntries("Deporte Consciente");
// });
//
// page("/habilidades-y-talentos-a-desarrollar-coaching", function(context, next) {
//   setActiveOption(context.path);
//   loadCategoryEntries("Habilidades y Talentos a desarrollar (Coaching)");
// });
//
// page("/amar-desde-nuestro-zentro-y-relaciones-sociales-sanas", function(context, next) {
//   setActiveOption(context.path);
//   loadCategoryEntries("Amar desde nuestro Zentro y Relaciones Sociales Sanas");
// });
//
// page("/mecanismos-y-creencias-limitantes-del-ego-e-inteligencia-emocional", function(context, next) {
//   setActiveOption(context.path);
//   loadCategoryEntries("Mecanismos y creencias limitantes del Ego e Inteligencia Emocional");
// });
//
// page("/reconciliacion-e-integracion-con-la-familia-y-raices", function(context, next) {
//   setActiveOption(context.path);
//   loadCategoryEntries("Reconciliación e Integración con la Familia y Raíces");
// });
//
// page("/ciencia-e-investigacion", function(context, next) {
//   setActiveOption(context.path);
//   loadCategoryEntries("Ciencia e Investigación");
// });
//
// page("/audios-guiados-y-meditaciones", function(context, next) {
//   setActiveOption(context.path);
//   loadCategoryEntries("Audios guiados y meditaciones");
// });

page("/acerca-de-mi", function(context, next) {
  loadCategories();
  setActiveOption(context.path);
  loadHtml("about_me");
});

page("/contacto", function(context, next) {
  loadCategories();
  setActiveOption(context.path);
  loadHtml(context.path);
});

page('/entrada/:entryID', function(context, next) {
  loadCategories();
  renderPost(context.params.entryID);
});

page('*', function(context, next) {
  loadCategories();
  let active_option = setActiveOption(context.path);
  loadCategoryEntries(active_option);
});

page();
