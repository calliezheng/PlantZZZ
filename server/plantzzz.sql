DROP SCHEMA IF EXISTS plantzzz;
CREATE DATABASE plantzzz;
USE plantzzz;

DROP TABLE IF EXISTS plant;
CREATE TABLE plant (
  id INT NOT NULL AUTO_INCREMENT,
  acadamic_name VARCHAR(255) NOT NULL,
  daily_name VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS picture;
CREATE TABLE picture (
id INT NOT NULL AUTO_INCREMENT,
picture_file_name VARCHAR(255) NOT NULL,
plant_id INT NOT NULL,
is_active BOOLEAN DEFAULT TRUE,
PRIMARY KEY (id),
FOREIGN KEY (plant_id) REFERENCES plant(id)
);

DROP TABLE IF EXISTS user_type;
CREATE TABLE user_type (
id INT NOT NULL AUTO_INCREMENT,
type_name VARCHAR(255) NOT NULL,
is_active BOOLEAN DEFAULT TRUE,
PRIMARY KEY (id)
);

DROP TABLE IF EXISTS user;
CREATE TABLE user (
  id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  user_type INT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (id),
  FOREIGN KEY (user_type) REFERENCES user_type(id)
);

INSERT INTO user_type (id, type_name, is_active) VALUES
(1, 'Admin', 1),
(2, 'Student', 1);

INSERT INTO user (id, username, email, password, user_type, is_active) VALUES
(1, 'CallieZheng', 'Calliezheng233@gmail.com', '$2b$12$pM3cuZeVWhPMFSIUTes07.0TfiVOHhFD0MLQLeoxPiWb571cZc19u', 2, 1),
(2, 'PixelPioneer', 'PixelPioneer@mail.com', '$2b$12$O.f8VRMICUWK83Xqxe2UQe9jYfOAIU5EeykhaXt64eN2RF2IR6bzG', 2, 1),
(3, 'EchoSage', 'EchoSage@example.com', '$2b$12$gzj9cCuaEb5rK5NVrHxrbeSJ0ZqSqUg9RizXdxNZj08LPMLkH3iiW', 2, 1),
(4, 'FrostVoyager', 'FrostVoyager@mail.com', '$2b$12$C.Bn8WoC9XBDeoitkwh9fuUS7lv9E9t7/kNE8Cd9M5MyPnE70kISe', 2, 1),
(5, 'Admin', 'Calliezheng@hotmail.com', '$2b$12$x8YaY8C5g4EW.FHqPz2eoOGYeL4GyO1X6H8C5ocnprExSOUs2a4hm', 1, 1);

INSERT INTO plant (id, acadamic_name, daily_name, is_active) VALUES
(1, "Acaena inermis 'Purpurea'", 'purple bidibid', 1),
(2, "Acanthus mollis", 'bears breeches', 1),
(3, "Acca sellowiana", 'feijoa', 1),
(4, "Acer griseum", 'paperbark maple', 1),
(5, "Acer palmatum", 'Japanese maple', 1),
(6, "Acer platanoides", 'Norway maple', 1),
(7, "Aciphylla dieffenbachii", 'Chatham Island spaniard', 1),
(8, "Aesculus hippocastanum", 'common horse chestnut', 1),
(9, "Agapanthus africanus", 'agapanthus', 1),
(10, "Agathis australis", 'kauri', 1),
(11, "Agave sp.", 'agave', 1),
(12, "Alectryon excelsus", 'titoki', 1),
(13, "Alnus glutinosa", 'black alder', 1),
(14, "Anemanthele lessoniana", 'wind grass', 1),
(15, "Anigozanthos flavidus", 'kangaroo paw', 1),
(16, "Apodasmia similis", 'oioi', 1),
(17, "Aquilegia sp.", 'Granny_s Bonnet', 1),
(18, "Arbutus unedo", 'strawberry tree', 1),
(19, "Aristotelia serrata", 'winberry or makomako', 1),
(20, "Arthropodium cirratum", 'rengarenga', 1),
(21, "Asplenium bulbiferum", 'Hen and Chiken Fern', 1),
(22, "Asplenium oblongifolium", 'shining spleenwort', 1),
(23, "Astelia chathamica", 'Chatham Islands astelia', 1),
(24, "Aucuba japonica", 'spotted or Japanese laurel', 1),
(25, "Austroderia richardii", 'South Island toe toe', 1),
(26, "Azara microphylla", 'vanilla tree', 1),
(27, "Banksia integrifolia", 'coastal banksia', 1),
(28, "Bergenia cordifolia", 'heart leaf bergenia', 1),
(29, "Betula pendula", 'silver birch', 1),
(30, "Blechnum discolor", 'Crown Fern', 1),
(31, "Brachychiton populneus", 'kurrajong or bottletree', 1),
(32, "Brachyglottis greyi", 'NZ daisy bush', 1),
(33, "Brachyglottis rotundifolia", 'muttonbird scrub', 1),
(34, "Buxus sempervirens", 'box hedge', 1),
(35, "Callistemon sp.", 'bottle brush', 1),
(36, "Camellia japonica", 'Japanese camelia', 1),
(37, "Camellia sasanqua", 'autumn camellia', 1),
(38, "Carex secta", 'pukio', 1),
(39, "Carex testacea", 'orange sedge', 1),
(40, "Carmichaelia appressa", 'native prostrate broom', 1),
(41, "Carmichaelia australis", 'NZ Native Broom', 1),
(42, "Carmichaelia stevensonii", 'weeping broom', 1),
(43, "Carmichaelia williamsii", 'NZ giant flowering broom', 1),
(44, "Carpodetus serratus", 'marble leaf or putaputaweta', 1),
(45, "Catalpa bignonioides", 'Indian bean tree', 1),
(46, "Celmisia sp.", 'mountain daisy', 1),
(47, "Cercis canadensis _Texas White_", 'Texas white redbud', 1),
(48, "Chamaecytisus palmensis", 'Tree Lucerne', 1),
(49, "Chionochloa flavicans", 'miniature toetoe', 1),
(50, "Clematis afoliata", 'Leafless Clematis', 1),
(51, "Clematis paniculata", 'puawhananga', 1),
(52, "Clianthus maximus", 'kakabeak', 1),
(53, "Clivia sp.", 'natal or bush lily', 1),
(54, "Coleonema pulchrum _Sunset Gold_", 'confetti bush', 1),
(55, "Convolvulus cneorum", 'morning glory or silverbush', 1),
(56, "Coprosma _Black Cloud_", 'Black Cloud Coprosma', 1),
(57, "Coprosma acerosa _Hawera_", 'Hawera sand coprosma', 1),
(58, "Coprosma repens", 'mlrror bush or taupata', 1),
(59, "Coprosma rugosa _Lobster_", 'red coprosma', 1),
(60, "Coprosma X kirkii", 'groundcover coprosma', 1),
(61, "Cordyline australis", 'cabbage tree', 1),
(62, "Cornus alba", 'Siberian dogwood', 1),
(63, "Cornus florida", 'dogwood', 1),
(64, "Corokia X virgata _Bronze King_", 'bronze corokia', 1),
(65, "Corylus avellana", 'common hazel', 1),
(66, "Corynocarpus laevigatus", 'karaka or NZ laurel', 1),
(67, "Cupressus macrocarpa", 'macrocarpa', 1),
(68, "Cupressus sempervirens", 'Italian cypress', 1),
(69, "Cyclamen hederifolium", 'ivy leaved cyclamen', 1),
(70, "Cytisus proliferus", 'tree lucerne or tagasaste', 1),
(71, "Daphne odora", 'winter daphne', 1),
(72, "Dianella nigra", 'turutu', 1),
(73, "Discaria toumatou", 'matagouri', 1),
(74, "Disphyma australe", 'horokaka or native ice plant', 1),
(75, "Dodonaea viscosa _Purpurea_", 'akeake or hopbush', 1),
(76, "Dracophyllum sinclairii", 'inaka or neinei', 1),
(77, "Echium candicans", 'pride of Madeira', 1),
(78, "Eucalyptus viminalis", 'manna gum', 1),
(79, "Fagus sylvatica", 'common or English beech', 1),
(80, "Fatsia japonica", 'Japanese Aralia', 1),
(81, "Festuca actae", 'Banks Peninsula blue tussock', 1),
(82, "Ficus pumila", 'creeping fig', 1),
(83, "Fraxinus excelsior", 'European or common ash', 1),
(84, "Fuchsia procumbens", 'creeping fuchsia', 1),
(85, "Fuscospora fusca", 'red beech', 1),
(86, "Fuscospora solandri", 'black beech', 1),
(87, "Garrya elliptica", 'Silk Tassel Bush', 1),
(88, "Griselinia littoralis", 'broadleaf or kapuka', 1),
(89, "Haloregis erecta _Purpurea_", 'toatoa', 1),
(90, "Hamamelis mollis", 'witch hazel', 1),
(91, "Heliohebe hulkeana", 'New Zealand lilac', 1),
(92, "Helleborus argutifolius", 'Corsican hellebore', 1),
(93, "Helleborus foetidus", 'Stinking Hellebore', 1),
(94, "Hoheria angustifolia", 'narrow leaved lacebark', 1),
(95, "Hoheria sexstylosa", 'lacebark or houhere', 1),
(96, "Hydrangea macrophylla", 'mophead hydrangea', 1),
(97, "Hydrangea paniculata", 'panicled hydrangea', 1),
(98, "Hydrangea quercifolia _Pee Wee_", 'oak leaf hydrangea', 1),
(99, "Ilex aquifolium", 'English holly', 1),
(100, "Juncus pallidus", 'giant club rush', 1),
(101, "Knightia excelsa", 'rewarewa (NZ honeysuckle)', 1),
(102, "Kunzea ericoides", 'kanuka', 1),
(103, "Laurus nobilis", 'bay tree', 1),
(104, "Lavandula X intermedia", 'hybrid lavender', 1),
(105, "Leonohebe cupressoides", 'frangrant hebe', 1),
(106, "Leucadendron argenteum", 'Silver Tree', 1),
(107, "Leucadendron salignum", 'conebush', 1),
(108, "Libertia ixioides", 'NZ iris or mikoikoi', 1),
(109, "Liquidambar styraciflua", 'American sweetgum', 1),
(110, "Lomandra longifolia", 'basket grass', 1),
(111, "Lomaria discolor", 'crown fern', 1),
(112, "Lophomyrtus obcordata", 'rohutu or NZ myrtle', 1),
(113, "Lophomyrtus x ralphii", 'hybrid lophomyrtus or NZ myrtle', 1),
(114, "Lophozonia menziesii", 'silver beech', 1),
(115, "Magnolia grandiflora _Little Gem_", 'dwarf magnolia', 1),
(116, "Magnolia X soulangeana", 'saucer or Chinese magnolia', 1),
(117, "Malus sp.", 'apple tree', 1),
(118, "Melicytus alpinus", 'porcupine scrub', 1),
(119, "Melicytus lanceolatus", 'Narrow Leaved Mahoe', 1),
(120, "Melicytus ramiflorus", 'mahoe or whiteywood', 1),
(121, "Metrosideros umbellata", 'Southern Rata', 1),
(122, "Microleana avenacea", 'bush rice grass', 1),
(123, "Muehlenbeckia astonii", 'shrubby tororaro', 1),
(124, "Muehlenbeckia australis", 'pohuehue', 1),
(125, "Muehlenbeckia axillaris", 'creeping muehlenbeckia', 1),
(126, "Muehlenbeckia complexa", 'small-leaved pohuehue', 1),
(127, "Nandina domestica 'Pygmaea'", 'dwarf heavenly bamboo', 1),
(128, "Nepeta mussinii", 'cat mint', 1),
(129, "Olea europaea", 'olive tree', 1),
(130, "Olearia lineata", 'twiggy tree daisy', 1),
(131, "Olearia paniculata", 'Golden Akeake or Akiraho', 1),
(132, "Olearia X macrodonta", 'NZ or Mountain Holly', 1),
(133, "Ozothamnus leptophylllus", 'Cottonwood or Tauhinu', 1),
(134, "Pachysandra terminalis", 'Japanese spurge', 1),
(135, "Pachystegia insignis", 'Malborough rock daisy', 1),
(136, "Pectinopitys ferruginea", 'miro', 1),
(137, "Phebalium squameum", 'satinwood', 1),
(138, "Phormium cookianum", 'wharariki or mountain Flax', 1),
(139, "Phormium tenax", 'harakeke or NZ flax', 1),
(140, "Photinia X fraseri _Robusta_", 'photinia', 1),
(141, "Phyllocladus alpinus", 'mountain toatoa or celery pine', 1),
(142, "Phyllocladus trichomanoides", 'tenakaha', 1),
(143, "Pimelea prostrata", 'NZ daphne', 1),
(144, "Piper excelsum", 'kawakawa', 1),
(145, "Pittosporum crassifolium", 'karo', 1),
(146, "Pittosporum eugenioides", 'lemonwood or tarata', 1),
(147, "Pittosporum patulum", 'Pitpat', 1),
(148, "Pittosporum tenuifolium", 'kohuhu or black matipo', 1),
(149, "Plagianthus divarivatus", 'swamp ribbonwood', 1),
(150, "Plagianthus regius", 'lowland ribbonwood', 1),
(151, "Platanus orientalis _Digitata_", 'cut leaf plane', 1),
(152, "Platanus x acerifolia", 'London plane', 1),
(153, "Podocarpus laetus", 'mountain or Hall_s totara', 1),
(154, "Podocarpus nivalis", 'snow or mountain totara', 1),
(155, "Podocarpus totara", 'totara', 1),
(156, "Polyspora axillaris", 'fried egg plant', 1),
(157, "Polystichum vestitum", 'prickly shield fern or puniu', 1),
(158, "Populus trichocarpa", 'black cottonwood', 1),
(159, "Pratia (syn. Lobelia) angulata", 'panakenake', 1),
(160, "Protea neriifolia", 'oleanderleaf protea', 1),
(161, "Prumnopitys taxifolia", 'matai', 1),
(162, "Prunus x yedoensis", 'Yoshino cherry', 1),
(163, "Pseudopanax lessonii", 'houpara', 1),
(164, "Pseudowintera colorata", 'horopito or pepper tree', 1),
(165, "Quercus palustris", 'pin oak', 1),
(166, "Quercus robur", 'English oak', 1),
(167, "Rhododendron sp.", 'azalea', 1),
(168, "Rhopalostylis sapida", 'nikau palm', 1),
(169, "Robinia pseudoacacia _Lace Lady_", 'contoured black locust', 1),
(170, "Rosa sp. _Ivey Hall_", 'yellow floribunda rose', 1),
(171, "Salvia officinalis", 'common sage', 1),
(172, "Santolina chamaecyparissus", 'lavender cotton', 1),
(173, "Sarcococca confusa", 'sweet box', 1),
(174, "Scleranthus biflorus", 'knawel cushion or cushion plant', 1),
(175, "Sedum spectabile _Autumn Joy_", 'stonecrop', 1),
(176, "Sequoia sempervirens", 'redwood', 1),
(177, "Skimmia japonica", 'Japanese skimmia', 1),
(178, "Sophora microphylla", 'South Island kowhai', 1),
(179, "Sophora prostrata", 'prostrate kowhai', 1),
(180, "Teucridium parvifolium", 'teucridium', 1),
(181, "Tilia cordata", 'lime tree', 1),
(182, "Tilia vulgaris", 'Lime Tree', 1),
(183, "Trachycarpus fortunei", 'Chinese Windmill Palm_', 1),
(184, "Typha orientalis", 'raupo or bullrush', 1),
(185, "Veronica _Emerald Green_", 'Whipcord Hebe', 1),
(186, "Veronica _Wiri Mist_", 'Wiri Mist Hebe', 1),
(187, "Veronica hulkeana", 'New Zeland lilac', 1),
(188, "Veronica odora _Prostrata_", 'prostrate hebe', 1),
(189, "Veronica sp. _Wiri MIst_", 'wiri mist hebe', 1),
(190, "Veronica speciosa", 'large leaved hebe', 1),
(191, "Veronica topiaria", 'topiary hebe', 1),
(192, "Viburnum japonicum", 'Japanese Viburnum', 1),
(193, "Viburnum tinus", 'laurustinus', 1),
(194, "Acer palmatum _Senkaki_", 'coral bark maple', 1),
(195, "Alstroemeria spp.", 'Peruvian Lily', 1),
(196, "Buxus sempervirens", 'box hedge', 1),
(197, "Carpinus betulus", 'European hornbeam', 1),
(198, "Chimonanthus praecox", 'wintersweet', 1),
(199, "Chionochloa rubra", 'Red Tussock', 1),
(200, "Choisya ternata", 'Mexican orange blossom', 1),
(201, "Choisya X dewitteana _Aztec Pearl", 'Mexican orange blossom', 1),
(202, "Coprosma propinqua", 'mingimingi', 1),
(203, "Cotinus coggygria", 'smoke bush', 1),
(204, "Cotoneaster horizontalis", 'rock spray', 1),
(205, "Dacrydium cupressinum", 'rimu', 1),
(206, "Daphne bholua", 'Nepalese paper plant', 1),
(207, "Dianella sp. _Little Rev_ ", 'dianella', 1),
(208, "Dianella tasmania _Blaze_", 'Dianella', 1),
(209, "Dicksonia squarrosa", 'wheki or rough tree fern', 1),
(210, "Euphorbia glauca", 'shore spurge or waiu-atua', 1),
(211, "Fuscospora cliffortioides", 'mountain beech', 1),
(212, "Ginkgo biloba", 'maidenhair tree', 1),
(213, "Grevillea banksii X bipinnatifida", 'grevillea', 1),
(214, "Helleborus orientalis", 'lenten rose', 1),
(215, "Hoheria lyallii", 'mountain lacebark', 1),
(216, "Libertia peregrinans", 'NZ iris', 1),
(217, "Liriodendron tulipifera", 'tulip tree', 1),
(218, "Magnolia liliflora _Nigra_", 'deciduous magnolia', 1),
(219, "Michelia yunnanensis", 'evergreen michelia', 1),
(220, "Myoporum laetum", 'ngaio', 1),
(221, "Myosotidium hortensia", 'Chatham Island forget me not', 1),
(222, "Narcissus sp.", 'Daffodil', 1),
(223, "Olearia cheesemanii", 'NZ daisy bush', 1),
(224, "Ophiopogon planiscapus _Black Dragon_", 'black mondo grass', 1),
(225, "Zantedeschia aethiopica", 'arum or calla Lily', 1),
(226, "Wisteria sinensis", 'Chinese wisteria', 1),
(227, "Veronica salicifolia", 'Koromiko', 1),
(228, "Ulmus carpinifolia _Variegata_", 'variegated elm', 1),
(229, "Solanum laciniatum", 'poroporo', 1),
(230, "Sophora molloyi _Dragons Gold_", 'Cook Strait kowhai', 1),
(231, "Sophora tetraptera", 'North Island kowhai', 1),
(232, "Sorbus aucuparia", 'rowan', 1),
(233, "Rhododendron sp.", 'rhododendron', 1),
(234, "Rosmarinus officinalis", 'rosemary', 1),
(235, "Rubus cissoides", 'bush lawyer', 1),
(236, "Quercus rubra", 'red oak', 1),
(237, "Pachystegia rufa", 'Marlborough rock daisy', 1),
(238, "Pieris japonica", 'lily of the valley', 1),
(239, "Pittosporum tenuifolium _Sumo_", 'dwarf pittosporum', 1),
(240, "Poa cita", 'silver tussock', 1),
(241, "Prunus laurocerasus", 'cherry laurel', 1),
(242, "Prunus lusitanica", 'Portuguese Cherry Laurel', 1),
(243, "Pseudopanax crassifolius", 'lancewood', 1),
(244, "Pseudopanax ferox", 'fierce lancewood', 1),
(245, "Pyrus communis", 'common pear', 1);
