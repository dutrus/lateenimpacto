-- =====================================================================
-- MIGRACIÓN 02 — Soft Delete: marcar activo=false a oportunidades
--                 que NO aplican explícitamente a Latinoamérica.
--                 NO se borra ninguna fila.
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- =====================================================================

UPDATE public.opportunities
SET activo       = false,
    aplica_latam = false,
    razon_filtro = 'No aplica explícitamente a Latinoamérica'
WHERE NOT (
    lower(
        title || ' ' ||
        COALESCE(description, '') || ' ' ||
        COALESCE(category,    '')
    ) ~ '(méxico|mexico|argentina|colombia|chile|peru|perú|brasil|brazil|venezuela|ecuador|bolivia|paraguay|uruguay|guatemala|honduras|el salvador|nicaragua|costa rica|panama|panamá|cuba|república dominicana|puerto rico|américa latina|latin america|latinoamérica|iberoamérica|latam|centroamérica|sudamérica|caribe|mesoamérica)'
);

-- =====================================================================
-- REPORTE FINAL — Cuántas filas quedaron con activo = true
-- =====================================================================
SELECT
    COUNT(*)                                           AS total_filas,
    COUNT(*) FILTER (WHERE activo = true)              AS activo_true,
    COUNT(*) FILTER (WHERE activo = false)             AS activo_false,
    COUNT(*) FILTER (WHERE aplica_latam = true)        AS aplica_latam_true,
    COUNT(*) FILTER (WHERE aplica_latam = false)       AS aplica_latam_false
FROM public.opportunities;
