const generateSqlFromSections = (sections: any[]) => {
  let sqlCode: string = '';
  const keys = Object.keys(sections);
  for (const key of keys) {
    const section = sections[key];
    const { order, slug, name, description, widgets } = section;
    // sqlCode += `INSERT INTO sections ("order", "slug", "name", "description") VALUES (${order}, '${slug}', '${name}', '${description}') ON CONFLICT ("order") DO UPDATE SET "slug" = EXCLUDED."slug", "name" = EXCLUDED."name", "description" = EXCLUDED."description";\n`;

    let widgetsSql = '';
    for (const widget of widgets) {
      const {
        id,
        question,
        indicator,
        defaultVisualization,
        availableVisualizations,
        sectionOrder,
      } = widget;
      widgetsSql += `{"id": ${id}, "question": "${question}", "indicator": "${indicator}", "default_visualization": "${defaultVisualization}", "visualizations": "${availableVisualizations}", "section_order": ${sectionOrder}},`;
      // sqlCode += `INSERT INTO base_widgets ("id", "section_order", "visualisations", "section_id", "default_visualization", "question", "indicator") VALUES (${id}, ${sectionOrder}, '${availableVisualizations}', ${section.order}, '${defaultVisualization}', '${question}', '${indicator}') ON CONFLICT (id) DO NOTHING;\n`;
      // break;
    }
    widgetsSql = widgetsSql.slice(0, -1);
    sqlCode += `SELECT upsert_section_with_widgets('{"order": ${order}, "slug": "${slug}", "name": "${name}", "description": "${description}"}','[${widgetsSql}]'::jsonb);\n`;
  }

  return sqlCode;
};

export const SQLAdapter = {
  generateSqlFromSections,
};
