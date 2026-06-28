-- Datos corregidos para importar en la base de datos de Render
-- Codificación de caracteres arreglada y columnas ajustadas a la estructura actual

-- Clientes
INSERT INTO public.clientes (id, nombre, creado_en) VALUES (9, 'Juan García', '2026-05-09 18:30:45.50287');
INSERT INTO public.clientes (id, nombre, creado_en) VALUES (10, 'Jackson Michael', '2026-05-09 18:32:35.667245');
INSERT INTO public.clientes (id, nombre, creado_en) VALUES (12, 'Carlos González', '2026-06-20 20:38:57.932297');
INSERT INTO public.clientes (id, nombre, creado_en) VALUES (14, 'Ricardo Lopez', '2026-06-20 21:39:22.128202');
INSERT INTO public.clientes (id, nombre, creado_en) VALUES (15, 'Cristiano Ronaldo', '2026-06-27 17:04:17.938045');
INSERT INTO public.clientes (id, nombre, creado_en) VALUES (16, 'Arnold Schwarzenegger', '2026-06-27 19:30:26.028721');
INSERT INTO public.clientes (id, nombre, creado_en) VALUES (17, 'Lucia Caminos', '2026-06-27 20:25:13.586871');
INSERT INTO public.clientes (id, nombre, creado_en) VALUES (18, 'Cristina Aguilera', '2026-06-27 20:56:50.310545');
INSERT INTO public.clientes (id, nombre, creado_en) VALUES (13, 'Jeff Bezos', '2026-06-20 21:09:05.507192');
INSERT INTO public.clientes (id, nombre, creado_en) VALUES (11, 'Tony Stark', '2026-06-20 20:08:12.82057');

-- Productos
INSERT INTO public.productos (id, nombre, categoria, precio, descripcion, creado_en, imagen) VALUES (12, 'CORRECTOR LIQUIDO', 'Papelería', 2.80, 'Corrector líquido tipo pluma, diseñado para ofrecer una corrección precisa, limpia y profesiona.', '2026-06-28 10:39:18.635002', '/uploads/producto_1782661158575.JPG');
INSERT INTO public.productos (id, nombre, categoria, precio, descripcion, creado_en, imagen) VALUES (13, 'PORTA LAPIZ PLAST. TRANSPARENTE', 'Oficina', 1.20, 'Porta lápices cristalino, diseñado para la organización de artículos de escritura en oficinas y espacios de estudio.', '2026-06-28 11:09:29.042827', '/uploads/producto_1782662968880.JPG');
INSERT INTO public.productos (id, nombre, categoria, precio, descripcion, creado_en, imagen) VALUES (14, 'PERFORADORA STUDMARK DE 1 ORIFICIO', 'Papelería', 1.50, 'Compacta y resistente, capacidad de 6 hojas, ideal para perforar documentos individuales.', '2026-06-28 11:13:57.129576', '/uploads/producto_1782663237071.JPG');
INSERT INTO public.productos (id, nombre, categoria, precio, descripcion, creado_en, imagen) VALUES (11, 'IMPRESORA EPSON TINTA CONTINUA', 'Tecnología', 159.00, 'Perfecta para hogares, y oficinas que buscan economía y calidad sin complicaciones.', '2026-06-27 21:16:11.257571', '/uploads/producto_1782613068769.jpg');
INSERT INTO public.productos (id, nombre, categoria, precio, descripcion, creado_en, imagen) VALUES (15, 'PADFOLIO CON ARCHIVADOR COLOR NEGRO', 'Oficina', 8.33, 'Herramienta práctica para quienes buscan mantener sus archivos en orden con un estilo ejecutivo.', '2026-06-28 11:40:18.641222', '/uploads/producto_1782664818572.jpg');
INSERT INTO public.productos (id, nombre, categoria, precio, descripcion, creado_en, imagen) VALUES (8, 'SACAGRAPAS NEGRO STUDMARK', 'Oficina', 0.62, 'Sacagrapas de metal Studmark en color negro con diseño de pinza.', '2026-05-09 16:46:13.585039', '/uploads/producto_1778366636545.jpg');
INSERT INTO public.productos (id, nombre, categoria, precio, descripcion, creado_en, imagen) VALUES (6, 'GRAPAS STANDARD 26/6 BOSTITCH', 'Oficina', 1.73, 'Caja de 5,000 grapas Bostitch estándar 26/6 de acero galvanizado.', '2026-05-09 16:42:48.815025', '/uploads/producto_1778366798703.jpg');
INSERT INTO public.productos (id, nombre, categoria, precio, descripcion, creado_en, imagen) VALUES (5, 'ENGRAPADORA METALICA', 'Oficina', 9.40, 'Engrapadora metálica de alta resistencia. utiliza grapas estándar 26/6.', '2026-05-09 16:31:48.321038', '/uploads/producto_1778366805453.jpg');
INSERT INTO public.productos (id, nombre, categoria, precio, descripcion, creado_en, imagen) VALUES (3, 'MARCADOR PARA PIZARRA MAGISTRAL NEGRO 2U', 'Papelería', 2.50, 'Marcadores de color negro para pizarrón, 2 Unidades.', '2026-05-09 16:24:13.969914', '/uploads/producto_1778366854749.JPG');
INSERT INTO public.productos (id, nombre, categoria, precio, descripcion, creado_en, imagen) VALUES (7, 'DISPENSADOR DE TAPE STUDMARK', 'Oficina', 2.18, 'Dispensador de cinta adhesiva Studmark con base pesada antideslizante.', '2026-05-09 16:45:04.075115', '/uploads/producto_1778366789824.jpg');
INSERT INTO public.productos (id, nombre, categoria, precio, descripcion, creado_en, imagen) VALUES (4, 'CARTUCHO DE TINTA HP 662 NEGRO', 'Tecnología', 14.50, 'Ofrece impresiones nítidas, secado rápido y un rendimiento aproximado de 120 páginas.', '2026-05-09 16:29:14.208252', '/uploads/producto_1778366816630.JPG');
INSERT INTO public.productos (id, nombre, categoria, precio, descripcion, creado_en, imagen) VALUES (9, 'BLOCK DE HOJAS STUDMARK', 'Papelería', 10.90, 'Hojas fáciles de desprender, formato práctico para escuela u oficina.', '2026-06-27 20:48:11.025942', '/uploads/producto_1782611290868.jpg');
INSERT INTO public.productos (id, nombre, categoria, precio, descripcion, creado_en, imagen) VALUES (10, 'TECLADO MICROSOFT BT NEGRO', 'Tecnología', 89.90, 'Destaca por su diseño compacto, ofrece una conexión inalámbrica fiable mediante Bluetooth.', '2026-06-27 21:00:31.792819', '/uploads/producto_1782612053166.jpg');
INSERT INTO public.productos (id, nombre, categoria, precio, descripcion, creado_en, imagen) VALUES (2, 'CALCULADORA CASIO CIENTIFICA', 'Tecnología', 16.80, 'Calculadora científica Casio, un modelo clásico muy utilizado en entornos escolares y académicos.', '2026-05-09 16:18:39.42317', '/uploads/producto_1778366866076.jpg');
INSERT INTO public.productos (id, nombre, categoria, precio, descripcion, creado_en, imagen) VALUES (1, 'BOLIGRAFO BIC MEDIANO AZUL 12U', 'Papelería', 3.20, 'Paquete de 12 bolígrafos BIC Mediano diseñados para ofrecer una escritura suave y constante.', '2026-05-09 12:02:18.040269', '/uploads/producto_1778366907833.JPG');

-- Usuarios (las contraseñas ya están encriptadas con bcrypt, son las mismas que en tu base local)
INSERT INTO public.usuarios (id, nombre, email, password, rol, creado_en) VALUES (1, 'Gabriel Rosas', 'gabriel@correo.com', '$2b$10$LSM7jpA1x6WA4sl5fCr36uZQlG7/PoKr98lN8jALfTINEZ8MNdR8a', 'admin', '2026-05-09 11:42:27.254038');
INSERT INTO public.usuarios (id, nombre, email, password, rol, creado_en) VALUES (7, 'Laura Toribio', 'laura@correo.com', '$2b$10$yEywXKeP7Mvw4xazHYoxDu.IHyHK9BgPzZhzleYohyQxA5inBTVZm', 'admin', '2026-05-09 18:18:29.497707');

-- Ventas
INSERT INTO public.ventas (id, cliente_id, usuario_id, total, fecha) VALUES (9, 9, 1, 60.65, '2026-05-09 18:30:45.508972');
INSERT INTO public.ventas (id, cliente_id, usuario_id, total, fecha) VALUES (10, 10, 1, 41.10, '2026-05-09 18:32:35.672296');
INSERT INTO public.ventas (id, cliente_id, usuario_id, total, fecha) VALUES (11, 11, 1, 4.67, '2026-06-20 20:08:12.829845');
INSERT INTO public.ventas (id, cliente_id, usuario_id, total, fecha) VALUES (12, 11, 1, 10.06, '2026-06-20 20:37:51.550576');
INSERT INTO public.ventas (id, cliente_id, usuario_id, total, fecha) VALUES (13, 12, 1, 17.98, '2026-06-20 20:38:57.93444');
INSERT INTO public.ventas (id, cliente_id, usuario_id, total, fecha) VALUES (14, 13, 1, 15.52, '2026-06-20 21:09:05.510897');
INSERT INTO public.ventas (id, cliente_id, usuario_id, total, fecha) VALUES (15, 14, 1, 31.03, '2026-06-20 21:39:22.139057');
INSERT INTO public.ventas (id, cliente_id, usuario_id, total, fecha) VALUES (16, 15, 1, 2.33, '2026-06-27 17:04:17.945707');
INSERT INTO public.ventas (id, cliente_id, usuario_id, total, fecha) VALUES (17, 16, 1, 17.98, '2026-06-27 19:30:26.034322');
INSERT INTO public.ventas (id, cliente_id, usuario_id, total, fecha) VALUES (18, 17, 1, 35.95, '2026-06-27 20:25:13.595435');
INSERT INTO public.ventas (id, cliente_id, usuario_id, total, fecha) VALUES (19, 18, 1, 11.66, '2026-06-27 20:56:50.315781');

-- Detalle de venta
INSERT INTO public.detalle_venta (id, venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (14, 9, 1, 2, 3.20, 6.40);
INSERT INTO public.detalle_venta (id, venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (15, 9, 2, 2, 16.80, 33.60);
INSERT INTO public.detalle_venta (id, venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (16, 9, 4, 1, 14.50, 14.50);
INSERT INTO public.detalle_venta (id, venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (17, 9, 7, 1, 2.18, 2.18);
INSERT INTO public.detalle_venta (id, venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (18, 10, 1, 1, 3.20, 3.20);
INSERT INTO public.detalle_venta (id, venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (19, 10, 2, 1, 16.80, 16.80);
INSERT INTO public.detalle_venta (id, venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (20, 10, 4, 1, 14.50, 14.50);
INSERT INTO public.detalle_venta (id, venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (21, 10, 7, 1, 2.18, 2.18);
INSERT INTO public.detalle_venta (id, venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (22, 10, 6, 1, 1.73, 1.73);
INSERT INTO public.detalle_venta (id, venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (23, 11, 7, 2, 2.18, 4.36);
INSERT INTO public.detalle_venta (id, venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (24, 12, 5, 1, 9.40, 9.40);
INSERT INTO public.detalle_venta (id, venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (25, 13, 2, 1, 16.80, 16.80);
INSERT INTO public.detalle_venta (id, venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (26, 14, 4, 1, 14.50, 14.50);
INSERT INTO public.detalle_venta (id, venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (27, 15, 4, 2, 14.50, 29.00);
INSERT INTO public.detalle_venta (id, venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (28, 16, 7, 1, 2.18, 2.18);
INSERT INTO public.detalle_venta (id, venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (29, 17, 2, 1, 16.80, 16.80);
INSERT INTO public.detalle_venta (id, venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (30, 18, 2, 2, 16.80, 33.60);
INSERT INTO public.detalle_venta (id, venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (31, 19, 9, 1, 10.90, 10.90);

-- Inventario
INSERT INTO public.inventario (id, producto_id, cantidad, stock_minimo, actualizado_en) VALUES (9, 9, 11, 5, '2026-06-27 20:48:11.036162');
INSERT INTO public.inventario (id, producto_id, cantidad, stock_minimo, actualizado_en) VALUES (10, 10, 6, 5, '2026-06-27 21:00:31.799515');
INSERT INTO public.inventario (id, producto_id, cantidad, stock_minimo, actualizado_en) VALUES (2, 2, 6, 5, '2026-05-09 16:18:39.42864');
INSERT INTO public.inventario (id, producto_id, cantidad, stock_minimo, actualizado_en) VALUES (1, 1, 2, 5, '2026-05-09 12:02:18.047403');
INSERT INTO public.inventario (id, producto_id, cantidad, stock_minimo, actualizado_en) VALUES (12, 12, 25, 5, '2026-06-28 10:39:18.650606');
INSERT INTO public.inventario (id, producto_id, cantidad, stock_minimo, actualizado_en) VALUES (13, 13, 18, 5, '2026-06-28 11:09:29.056178');
INSERT INTO public.inventario (id, producto_id, cantidad, stock_minimo, actualizado_en) VALUES (14, 14, 14, 5, '2026-06-28 11:13:57.132899');
INSERT INTO public.inventario (id, producto_id, cantidad, stock_minimo, actualizado_en) VALUES (11, 11, 11, 5, '2026-06-27 21:16:11.260988');
INSERT INTO public.inventario (id, producto_id, cantidad, stock_minimo, actualizado_en) VALUES (15, 15, 4, 5, '2026-06-28 11:40:18.659741');
INSERT INTO public.inventario (id, producto_id, cantidad, stock_minimo, actualizado_en) VALUES (8, 8, 20, 5, '2026-05-09 16:46:13.589451');
INSERT INTO public.inventario (id, producto_id, cantidad, stock_minimo, actualizado_en) VALUES (3, 3, 5, 5, '2026-05-09 16:24:13.978694');
INSERT INTO public.inventario (id, producto_id, cantidad, stock_minimo, actualizado_en) VALUES (6, 6, 10, 5, '2026-05-09 16:42:48.823364');
INSERT INTO public.inventario (id, producto_id, cantidad, stock_minimo, actualizado_en) VALUES (5, 5, 8, 5, '2026-05-09 16:31:48.324243');
INSERT INTO public.inventario (id, producto_id, cantidad, stock_minimo, actualizado_en) VALUES (4, 4, 5, 5, '2026-05-09 16:29:14.211404');
INSERT INTO public.inventario (id, producto_id, cantidad, stock_minimo, actualizado_en) VALUES (7, 7, 5, 5, '2026-05-09 16:45:04.079535');

-- Mensajes de contacto
INSERT INTO public.mensajes_contacto (id, nombre, correo, mensaje, fecha) VALUES (2, 'Arnold Schwarzenegger', 'pruebadecorre@gmail.com', 'QUE BUENA TIENDAAAAA, LA RECOMIENDO AL 100%', '2026-06-27 19:32:14.957792');
INSERT INTO public.mensajes_contacto (id, nombre, correo, mensaje, fecha) VALUES (3, 'Jason Statham', 'prueba2@gmail.com', 'La mejor tienda online de la historia!!!!', '2026-06-27 19:33:20.144063');
INSERT INTO public.mensajes_contacto (id, nombre, correo, mensaje, fecha) VALUES (4, 'Lucia Caminos', 'luciaca@gmail.com', 'MUY BUENA ATENCIÓN!!!', '2026-06-27 20:25:56.234815');

-- Reiniciar las secuencias de auto-incremento para que coincidan con los IDs importados
SELECT setval('public.clientes_id_seq', 18);
SELECT setval('public.detalle_venta_id_seq', 31);
SELECT setval('public.inventario_id_seq', 15);
SELECT setval('public.mensajes_contacto_id_seq', 4);
SELECT setval('public.productos_id_seq', 15);
SELECT setval('public.usuarios_id_seq', 7);
SELECT setval('public.ventas_id_seq', 19);
