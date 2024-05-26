DROP SCHEMA IF EXISTS plantzzz;
CREATE DATABASE plantzzz;
USE plantzzz;

DROP TABLE IF EXISTS plant;
CREATE TABLE plant (
  id INT NOT NULL AUTO_INCREMENT,
  academic_name VARCHAR(255) NOT NULL,
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
  score INT NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (id),
  FOREIGN KEY (user_type) REFERENCES user_type(id)
);

DROP TABLE IF EXISTS plant_remembered;
CREATE TABLE plant_remembered (
  user_id INT NOT NULL,
  plant_id INT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (user_id, plant_id),
  FOREIGN KEY (user_id) REFERENCES user(id),
  FOREIGN KEY (plant_id) REFERENCES plant(id)
);

DROP TABLE IF EXISTS product_type;
CREATE TABLE product_type (
id INT NOT NULL AUTO_INCREMENT,
type_name VARCHAR(255) NOT NULL,
is_active BOOLEAN DEFAULT TRUE,
PRIMARY KEY (id)
);

DROP TABLE IF EXISTS product;
CREATE TABLE product (
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(255) NOT NULL,
  product_type INT NOT NULL,
  price INT NOT NULL,
  picture VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (id),
  FOREIGN KEY (product_type) REFERENCES product_type(id)
);

DROP TABLE IF EXISTS purchase;
CREATE TABLE purchase (
user_id INT NOT NULL,
product_id INT,
quantity INT NOT NULL DEFAULT 1,
PRIMARY KEY (user_id, product_id),
FOREIGN KEY (user_id) REFERENCES user(id),
FOREIGN KEY (product_id) REFERENCES product(id)
);

DROP TABLE IF EXISTS garden;
CREATE TABLE garden (
user_id INT NOT NULL,
garden_state TEXT NOT NULL,
PRIMARY KEY (user_id),
FOREIGN KEY (user_id) REFERENCES user(id)
	ON DELETE CASCADE
);

INSERT INTO user_type (type_name, is_active) VALUES
('Admin', 1),
('Student', 1);

INSERT INTO user (username, email, password, user_type, score, is_active) VALUES
('CallieZheng', 'Calliezheng233@gmail.com', '$2b$12$pM3cuZeVWhPMFSIUTes07.0TfiVOHhFD0MLQLeoxPiWb571cZc19u', 2, 10000, 1),
('PixelPioneer', 'PixelPioneer@mail.com', '$2b$12$O.f8VRMICUWK83Xqxe2UQe9jYfOAIU5EeykhaXt64eN2RF2IR6bzG', 2, 0, 1),
('EchoSage', 'EchoSage@example.com', '$2b$12$gzj9cCuaEb5rK5NVrHxrbeSJ0ZqSqUg9RizXdxNZj08LPMLkH3iiW', 2, 0, 1),
('FrostVoyager', 'FrostVoyager@mail.com', '$2b$12$C.Bn8WoC9XBDeoitkwh9fuUS7lv9E9t7/kNE8Cd9M5MyPnE70kISe', 2, 0, 1),
('Admin', 'Calliezheng@hotmail.com', '$2b$12$x8YaY8C5g4EW.FHqPz2eoOGYeL4GyO1X6H8C5ocnprExSOUs2a4hm', 1, 0, 1),
('Admin1', 'Staff1@hotmail.com', '$2b$12$x8YaY8C5g4EW.FHqPz2eoOGYeL4GyO1X6H8C5ocnprExSOUs2a4hm', 1, 0, 1),
('Admin2', 'Staff2@hotmail.com', '$2b$12$x8YaY8C5g4EW.FHqPz2eoOGYeL4GyO1X6H8C5ocnprExSOUs2a4hm', 1, 0, 1);

INSERT INTO plant (academic_name, daily_name, is_active) VALUES
("Acaena inermis _Purpurea_", 'purple bidibid', 1),
("Acanthus mollis", 'bears breeches', 1),
("Acca sellowiana", 'feijoa', 1),
("Acer griseum", 'paperbark maple', 1),
("Acer palmatum", 'Japanese maple', 1),
("Acer palmatum _Senkaki_", 'coral bark maple', 1),
("Acer platanoides", 'Norway maple', 1),
("Aciphylla dieffenbachii", 'Chatham Island spaniard', 1),
("Aesculus hippocastanum", 'common horse chestnut', 1),
("Agapanthus africanus", 'agapanthus', 1),
("Agathis australis", 'kauri', 1),
("Agave sp.", 'agave', 1),
("Alectryon excelsus", 'titoki', 1),
("Alnus glutinosa", 'black alder', 1),
("Alstroemeria spp.", 'Peruvian Lily', 1),
("Anemanthele lessoniana", 'wind grass', 1),
("Anigozanthos flavidus", 'kangaroo paw', 1),
("Apodasmia similis", 'oioi', 1),
("Aquilegia sp.", 'Granny_s Bonnet', 1),
("Arbutus unedo", 'strawberry tree', 1),
("Aristotelia serrata", 'winberry or makomako', 1),
("Arthropodium cirratum", 'rengarenga', 1),
("Asplenium bulbiferum", 'Hen and Chiken Fern', 1),
("Asplenium oblongifolium", 'shining spleenwort', 1),
("Astelia chathamica", 'Chatham Islands astelia', 1),
("Aucuba japonica", 'spotted or Japanese laurel', 1),
("Austroderia richardii", 'South Island toe toe', 1),
("Azara microphylla", 'vanilla tree', 1),
("Banksia integrifolia", 'coastal banksia', 1),
("Bergenia cordifolia", 'heart leaf bergenia', 1),
("Betula pendula", 'silver birch', 1),
("Blechnum discolor", 'Crown Fern', 1),
("Brachychiton populneus", 'kurrajong or bottletree', 1),
("Brachyglottis greyi", 'NZ daisy bush', 1),
("Brachyglottis monroi", 'Monro_s daisy', 1),
("Brachyglottis rotundifolia", 'muttonbird scrub', 1),
("Buxus sempervirens", 'box hedge', 1),
("Callistemon sp.", 'bottle brush', 1),
("Camellia japonica", 'Japanese camelia', 1),
("Camellia sasanqua", 'autumn camellia', 1),
("Canna X generalis", 'canna lily', 1),
("Carex secta", 'pukio', 1),
("Carex testacea", 'orange sedge', 1),
("Carmichaelia appressa", 'native prostrate broom', 1),
("Carmichaelia australis", 'NZ Native Broom', 1),
("Carmichaelia stevensonii", 'weeping broom', 1),
("Carmichaelia williamsii", 'NZ giant flowering broom', 1),
("Carpinus betulus", 'European hornbeam', 1),
("Carpodetus serratus", 'marble leaf or putaputaweta', 1),
("Catalpa bignonioides", 'Indian bean tree', 1),
("Celmisia sp.", 'mountain daisy', 1),
("Cercis canadensis _Texas White_", 'Texas white redbud', 1),
("Chamaecytisus palmensis", 'Tree Lucerne', 1),
("Chimonanthus praecox", 'wintersweet', 1),
("Chionochloa flavicans", 'miniature toetoe', 1),
("Chionochloa rubra", 'Red Tussock', 1),
("Choisya ternata", 'Mexican orange blossom', 1),
("Choisya X dewitteana _Aztec Pearl", 'Mexican orange blossom', 1),
("Clematis afoliata", 'Leafless Clematis', 1),
("Clematis paniculata", 'puawhananga', 1),
("Clianthus maximus", 'kakabeak', 1),
("Clivia sp.", 'natal or bush lily', 1),
("Coleonema pulchrum _Sunset Gold_", 'confetti bush', 1),
("Convolvulus cneorum", 'morning glory or silverbush', 1),
("Coprosma acerosa _Hawera_", 'Hawera sand coprosma', 1),
("Coprosma _Black Cloud_", 'Black Cloud Coprosma', 1),
("Coprosma propinqua", 'mingimingi', 1),
("Coprosma repens", 'mlrror bush or taupata', 1),
("Coprosma rugosa _Lobster_", 'red coprosma', 1),
("Coprosma X kirkii", 'groundcover coprosma', 1),
("Cordyline australis", 'cabbage tree', 1),
("Cornus alba", 'Siberian dogwood', 1),
("Cornus florida", 'dogwood', 1),
("Corokia X virgata _Bronze King_", 'bronze corokia', 1),
("Corylus avellana", 'common hazel', 1),
("Corynocarpus laevigatus", 'karaka or NZ laurel', 1),
("Cotinus coggygria", 'smoke bush', 1),
("Cotoneaster horizontalis", 'rock spray', 1),
("Cupressus macrocarpa", 'macrocarpa', 1),
("Cupressus sempervirens", 'Italian cypress', 1),
("Cyclamen hederifolium", 'ivy leaved cyclamen', 1),
("Cytisus proliferus", 'tree lucerne or tagasaste', 1),
("Dacrydium cupressinum", 'rimu', 1),
("Daphne bholua", 'Nepalese paper plant', 1),
("Daphne odora", 'winter daphne', 1),
("Dianella nigra", 'turutu', 1),
("Dianella sp. _Little Rev_ ", 'dianella', 1),
("Dianella tasmania _Blaze_", 'Dianella', 1),
("Dicksonia squarrosa", 'wheki or rough tree fern', 1),
("Discaria toumatou", 'matagouri', 1),
("Disphyma australe", 'horokaka or native ice plant', 1),
("Dodonaea viscosa _Purpurea_", 'akeake or hopbush', 1),
("Dracophyllum sinclairii", 'inaka or neinei', 1),
("Echium candicans", 'pride of Madeira', 1),
("Eucalyptus viminalis", 'manna gum', 1),
("Euphorbia glauca", 'shore spurge or waiu-atua', 1),
("Fagus sylvatica", 'common or English beech', 1),
("Fatsia japonica", 'Japanese Aralia', 1),
("Festuca actae", 'Banks Peninsula blue tussock', 1),
("Ficus pumila", 'creeping fig', 1),
("Fraxinus excelsior", 'European or common ash', 1),
("Fuchsia procumbens", 'creeping fuchsia', 1),
("Fuscospora cliffortioides", 'mountain beech', 1),
("Fuscospora fusca", 'red beech', 1),
("Fuscospora solandri", 'black beech', 1),
("Garrya elliptica", 'Silk Tassel Bush', 1),
("Ginkgo biloba", 'maidenhair tree', 1),
("Grevillea banksii X bipinnatifida", 'grevillea', 1),
("Griselinia littoralis", 'broadleaf or kapuka', 1),
("Haloregis erecta _Purpurea_", 'toatoa', 1),
("Hamamelis mollis", 'witch hazel', 1),
("Heliohebe hulkeana", 'New Zealand lilac', 1),
("Helleborus argutifolius", 'Corsican hellebore', 1),
("Helleborus foetidus", 'Stinking Hellebore', 1),
("Helleborus orientalis", 'lenten rose', 1),
("Hoheria angustifolia", 'narrow leaved lacebark', 1),
("Hoheria lyallii", 'mountain lacebark', 1),
("Hoheria sexstylosa", 'lacebark or houhere', 1),
("Hydrangea macrophylla", 'mophead hydrangea', 1),
("Hydrangea paniculata", 'panicled hydrangea', 1),
("Hydrangea quercifolia _Pee Wee_", 'oak leaf hydrangea', 1),
("Ilex aquifolium", 'English holly', 1),
("Juncus pallidus", 'giant club rush', 1),
("Knightia excelsa", 'rewarewa (NZ honeysuckle)', 1),
("Kunzea ericoides", 'kanuka', 1),
("Laurus nobilis", 'bay tree', 1),
("Lavandula X intermedia", 'hybrid lavender', 1),
("Leonohebe cupressoides", 'frangrant hebe', 1),
("Leucadendron argenteum", 'Silver Tree', 1),
("Leucadendron salignum", 'conebush', 1),
("Libertia ixioides", 'NZ iris or mikoikoi', 1),
("Libertia peregrinans", 'NZ iris', 1),
("Liquidambar styraciflua", 'American sweetgum', 1),
("Liriodendron tulipifera", 'tulip tree', 1),
("Lomandra longifolia", 'basket grass', 1),
("Lomaria discolor", 'crown fern', 1),
("Lophomyrtus obcordata", 'rohutu or NZ myrtle', 1),
("Lophomyrtus x ralphii", 'hybrid lophomyrtus or NZ myrtle', 1),
("Lophozonia menziesii", 'silver beech', 1),
("Magnolia grandiflora _Little Gem_", 'dwarf magnolia', 1),
("Magnolia liliflora _Nigra_", 'deciduous magnolia', 1),
("Magnolia X soulangeana", 'saucer or Chinese magnolia', 1),
("Malus sp.", 'apple tree', 1),
("Melicytus alpinus", 'porcupine scrub', 1),
("Melicytus lanceolatus", 'Narrow Leaved Mahoe', 1),
("Melicytus ramiflorus", 'mahoe or whiteywood', 1),
("Metrosideros umbellata", 'Southern Rata', 1),
("Michelia yunnanensis", 'evergreen michelia', 1),
("Microleana avenacea", 'bush rice grass', 1),
("Muehlenbeckia astonii", 'shrubby tororaro', 1),
("Muehlenbeckia australis", 'pohuehue', 1),
("Muehlenbeckia axillaris", 'creeping muehlenbeckia', 1),
("Muehlenbeckia complexa", 'small-leaved pohuehue', 1),
("Myoporum laetum", 'ngaio', 1),
("Myosotidium hortensia", 'Chatham Island forget me not', 1),
("Nandina domestica 'Pygmaea'", 'dwarf heavenly bamboo', 1),
("Narcissus sp.", 'Daffodil', 1),
("Nepeta mussinii", 'cat mint', 1),
("Olea europaea", 'olive tree', 1),
("Olearia cheesemanii", 'NZ daisy bush', 1),
("Olearia lineata", 'twiggy tree daisy', 1),
("Olearia paniculata", 'Golden Akeake or Akiraho', 1),
("Olearia X macrodonta", 'NZ or Mountain Holly', 1),
("Ophiopogon planiscapus _Black Dragon_", 'black mondo grass', 1),
("Ozothamnus leptophylllus", 'Cottonwood or Tauhinu', 1),
("Pachysandra terminalis", 'Japanese spurge', 1),
("Pachystegia insignis", 'Malborough rock daisy', 1),
("Pachystegia rufa", 'Marlborough rock daisy', 1),
("Pectinopitys ferruginea", 'miro', 1),
("Phebalium squameum", 'satinwood', 1),
("Phormium cookianum", 'wharariki or mountain Flax', 1),
("Phormium tenax", 'harakeke or NZ flax', 1),
("Photinia X fraseri _Robusta_", 'photinia', 1),
("Phyllocladus alpinus", 'mountain toatoa or celery pine', 1),
("Phyllocladus trichomanoides", 'tenakaha', 1),
("Pieris japonica", 'lily of the valley', 1),
("Pimelea prostrata", 'NZ daphne', 1),
("Piper excelsum", 'kawakawa', 1),
("Pittosporum crassifolium", 'karo', 1),
("Pittosporum eugenioides", 'lemonwood or tarata', 1),
("Pittosporum patulum", 'Pitpat', 1),
("Pittosporum tenuifolium", 'kohuhu or black matipo', 1),
("Pittosporum tenuifolium _Sumo_", 'dwarf pittosporum', 1),
("Plagianthus divarivatus", 'swamp ribbonwood', 1),
("Plagianthus regius", 'lowland ribbonwood', 1),
("Platanus orientalis _Digitata_", 'cut leaf plane', 1),
("Platanus x acerifolia", 'London plane', 1),
("Poa cita", 'silver tussock', 1),
("Podocarpus laetus", 'mountain or Hall_s totara', 1),
("Podocarpus nivalis", 'snow or mountain totara', 1),
("Podocarpus totara", 'totara', 1),
("Polyspora axillaris", 'fried egg plant', 1),
("Polystichum vestitum", 'prickly shield fern or puniu', 1),
("Populus trichocarpa", 'black cottonwood', 1),
("Pratia (syn. Lobelia) angulata", 'panakenake', 1),
("Protea neriifolia", 'oleanderleaf protea', 1),
("Prumnopitys taxifolia", 'matai', 1),
("Prunus laurocerasus", 'cherry laurel', 1),
("Prunus lusitanica", 'Portuguese Cherry Laurel', 1),
("Prunus x yedoensis", 'Yoshino cherry', 1),
("Pseudopanax lessonii", 'houpara', 1),
("Pseudopanax crassifolius", 'lancewood', 1),
("Pseudopanax ferox", 'fierce lancewood', 1),
("Pseudowintera colorata", 'horopito or pepper tree', 1),
("Pyrus communis", 'common pear', 1),
("Quercus palustris", 'pin oak', 1),
("Quercus robur", 'English oak', 1),
("Quercus rubra", 'red oak', 1),
("Rhododendron sp.", 'azalea', 1),
("Rhododendron sp.", 'rhododendron', 1),
("Rhopalostylis sapida", 'nikau palm', 1),
("Robinia pseudoacacia _Lace Lady_", 'contoured black locust', 1),
("Rosa sp. _Ivey Hall_", 'yellow floribunda rose', 1),
("Rosmarinus officinalis", 'rosemary', 1),
("Rubus cissoides", 'bush lawyer', 1),
("Salvia officinalis", 'common sage', 1),
("Santolina chamaecyparissus", 'lavender cotton', 1),
("Sarcococca confusa", 'sweet box', 1),
("Scleranthus biflorus", 'knawel cushion or cushion plant', 1),
("Sedum spectabile _Autumn Joy_", 'stonecrop', 1),
("Sequoia sempervirens", 'redwood', 1),
("Skimmia japonica", 'Japanese skimmia', 1),
("Solanum laciniatum", 'poroporo', 1),
("Sophora microphylla", 'South Island kowhai', 1),
("Sophora molloyi _Dragons Gold_", 'Cook Strait kowhai', 1),
("Sophora prostrata", 'prostrate kowhai', 1),
("Sophora tetraptera", 'North Island kowhai', 1),
("Sorbus aucuparia", 'rowan', 1),
("Teucridium parvifolium", 'teucridium', 1),
("Tilia cordata", 'lime tree', 1),
("Tilia vulgaris", 'Lime Tree', 1),
("Trachycarpus fortunei", 'Chinese Windmill Palm_', 1),
("Typha orientalis", 'raupo or bullrush', 1),
("Ulmus carpinifolia _Variegata_", 'variegated elm', 1),
("Veronica _Emerald Green_", 'Whipcord Hebe', 1),
("Veronica hulkeana", 'New Zeland lilac', 1),
("Veronica odora _Prostrata_", 'prostrate hebe', 1),
("Veronica salicifolia", 'Koromiko', 1),
("Veronica sp. _Wiri MIst_", 'Wiri Mist Hebe', 1),
("Veronica speciosa", 'large leaved hebe', 1),
("Veronica topiaria", 'topiary hebe', 1),
("Viburnum japonicum", 'Japanese Viburnum', 1),
("Viburnum tinus", 'laurustinus', 1),
("Wisteria sinensis", 'Chinese wisteria', 1),
("Zantedeschia aethiopica", 'arum or calla Lily', 1);

INSERT INTO picture (picture_file_name, plant_id, is_active) VALUES
('Acaena inermis _Purpurea_ - purple bidibid.jpg', 1, 1),
('Acanthus mollis - bears breeches.jpg', 2, 1),
('Acca sellowiana - feijoa.jpg', 3, 1),
('Acer griseum - paperbark maple.jpg', 4, 1),
('Acer palmatum - Japanese maple.jpg', 5, 1),
('Acer palmatum _Senkaki_ - coral bark maple.jpg', 6, 1),
('Acer platanoides - Norway maple.jpg', 7, 1),
('Aciphylla dieffenbachii - Chatham Island spaniard.jpg', 8, 1),
('Aesculus hippocastanum - common horse chestnut.jpg', 9, 1),
('Agapanthus africanus - agapanthus.jpg', 10, 1),
('Agathis australis - kauri.jpg', 11, 1),
('Agave sp. - agave.jpeg', 12, 1),
('Alectryon excelsus - titoki.jpg', 13, 1),
('Alnus glutinosa - black alder.jpeg', 14, 1),
('Alstroemeria spp. - Peruvian Lily.jpg', 15, 1),
('Anemanthele lessoniana - wind grass.jpeg', 16, 1),
('Anigozanthos flavidus - kangaroo paw.jpeg', 17, 1),
('Apodasmia similis - oioi.jpg', 18, 1),
('Aquilegia sp. - Granny_s Bonnet.jpg', 19, 1),
('Arbutus unedo - strawberry tree.jpg', 20, 1),
('Aristotelia serrata - winberry or makomako.jpg', 21, 1),
('Arthropodium cirratum - rengarenga.jpeg', 22, 1),
('Asplenium bulbiferum - Hen and Chiken Fern.jpg', 23, 1),
('Asplenium oblongifolium - shining spleenwort.jpg', 24, 1),
('Astelia chathamica - Chatham Islands astelia.jpg', 25, 1),
('Aucuba japonica - spotted or Japanese laurel.jpg', 26, 1),
('Austroderia richardii - South Island toe toe.jpg', 27, 1),
('Azara microphylla - vanilla tree.jpg', 28, 1),
('Banksia integrifolia - coastal banksia.jpg', 29, 1),
('Bergenia cordifolia - heart leaf bergenia.jpg', 30, 1),
('Betula pendula - silver birch.jpg', 31, 1),
('Blechnum discolor - Crown Fern.jpg', 32, 1),
('Brachychiton populneus - kurrajong or bottletree.jpeg', 33, 1),
('Brachyglottis greyi - NZ daisy bush.jpg', 34, 1),
('Brachyglottis monroi - Monro_s daisy.jpg', 35, 1),
('Brachyglottis rotundifolia - muttonbird scrub.jpg', 36, 1),
('Buxus sempervirens - box hedge.jpg', 37, 1),
('Callistemon sp. - bottle brush.jpeg', 38, 1),
('Camellia japonica - Japanese camelia.jpg', 39, 1),
('Camellia sasanqua - autumn camellia.jpeg', 40, 1),
('Canna X generalis - canna lily.jpg', 41, 1),
('Carex secta - pukio.jpg', 42, 1),
('Carex testacea - orange sedge.jpg', 43, 1),
('Carmichaelia appressa - native prostrate broom.jpg', 44, 1),
('Carmichaelia australis - NZ Native Broom.jpg', 45, 1),
('Carmichaelia stevensonii - weeping broom.jpg', 46, 1),
('Carmichaelia williamsii - NZ giant flowering broom.jpeg', 47, 1),
('Carpinus betulus - European hornbeam.jpg', 48, 1),
('Carpodetus serratus - marble leaf or putaputaweta.jpg', 49, 1),
('Catalpa bignonioides - Indian bean tree.jpeg', 50, 1),
('Celmisia sp. - mountain daisy.jpeg', 51, 1),
('Cercis canadensis _Texas White_ - Texas white redbud.jpg', 52, 1),
('Chamaecytisus palmensis - Tree Lucerne.jpeg', 53, 1),
('Chimonanthus praecox - wintersweet.jpg', 54, 1),
('Chionochloa flavicans - miniature toetoe.jpg', 55, 1),
('Chionochloa rubra - Red Tussock.jpg', 56, 1),
('Choisya ternata - Mexican orange blossom.jpg', 57, 1),
('Choisya X dewitteana _Aztec Pearl_ - Mexican orange blossom.jpeg', 58, 1),
('Clematis afoliata - Leafless Clematis.jpg', 59, 1),
('Clematis paniculata - puawhananga.jpg', 60, 1),
('Clianthus maximus - kakabeak.jpg', 61, 1),
('Clivia sp. - natal or bush lily.webp', 62, 1),
('Coleonema pulchrum _Sunset Gold_ - confetti bush.jpg', 63, 1),
('Convolvulus cneorum - morning glory or silverbush.jpg', 64, 1),
('Coprosma acerosa _Hawera_ - Hawera sand coprosma.jpeg', 65, 1),
('Coprosma _Black Cloud_ - Black Cloud Coprosma.jpeg', 66, 1),
('Coprosma propinqua - mingimingi.jpeg', 67, 1),
('Coprosma repens - mIrror bush or taupata.jpg', 68, 1),
('Coprosma rugosa _Lobster_ - red coprosma.jpg', 69, 1),
('Coprosma X kirkii - groundcover coprosma.jpg', 70, 1),
('Cordyline australis - cabbage tree.jpeg', 71, 1),
('Cornus alba - Siberian dogwood.jpg', 72, 1),
('Cornus florida - dogwood.jpg', 73, 1),
('Corokia X virgata _Bronze King_ - bronze corokia.jpg', 74, 1),
('Corylus avellana - common hazel.jpeg', 75, 1),
('Corynocarpus laevigatus - karaka or NZ laurel.jpg', 76, 1),
('Cotinus coggygria - smoke bush.jpg', 77, 1),
('Cotoneaster horizontalis - rock spray.jpg', 78, 1),
('Cupressus macrocarpa - macrocarpa.jpg', 79, 1),
('Cupressus sempervirens - Italian cypress.jpg', 80, 1),
('Cyclamen hederifolium - ivy leaved cyclamen.jpg', 81, 1),
('Cytisus proliferus - tree lucerne or tagasaste.jpg', 82, 1),
('Dacrydium cupressinum - rimu.jpg', 83, 1),
('Daphne bholua - Nepalese paper plant.jpg', 84, 1),
('Daphne odora - winter daphne.jpg', 85, 1),
('Dianella nigra - turutu.jpeg', 86, 1),
('Dianella sp. _Little Rev_ - dianella.jpeg', 87, 1),
('Dianella tasmania _Blaze_ - Dianella.jpg', 88, 1),
('Dicksonia squarrosa - wheki or rough tree fern.jpg', 89, 1),
('Discaria toumatou - matagouri.jpg', 90, 1),
('Disphyma australe - horokaka or native ice plant.jpg', 91, 1),
('Dodonaea viscosa _Purpurea_ - akeake or hopbush.jpg', 92, 1),
('Dracophyllum sinclairii - inaka or neinei.jpg', 93, 1),
('Echium candicans - pride of Madeira.jpg', 94, 1),
('Eucalyptus viminalis - manna gum.jpg', 95, 1),
('Euphorbia glauca - shore spurge or waiu-atua.jpg', 96, 1),
('Fagus sylvatica - common or English beech.jpg', 97, 1),
('Fatsia japonica - Japanese Aralia.jpg', 98, 1),
('Festuca actae - Banks Peninsula blue tussock.jpg', 99, 1),
('Ficus pumila - creeping fig.jpg', 100, 1),
('Fraxinus excelsior - European or common ash.jpg', 101, 1),
('Fuchsia procumbens - creeping fuchsia.jpg', 102, 1),
('Fuscospora cliffortioides - mountain beech.jpeg', 103, 1),
('Fuscospora fusca - red beech.jpg', 104, 1),
('Fuscospora solandri - black beech.jpg', 105, 1),
('Garrya elliptica - Silk Tassel Bush.jpg', 106, 1),
('Ginkgo biloba - maidenhair tree.jpg', 107, 1),
('Grevillea banksii X bipinnatifida - grevillea.jpg', 108, 1),
('Griselinia littoralis - broadleaf or kapuka.jpg', 109, 1),
('Haloregis erecta _Purpurea_ - toatoa.jpg', 110, 1),
('Hamamelis mollis - witch hazel.jpg', 111, 1),
('Heliohebe hulkeana - New Zealand lilac.jpg', 112, 1),
('Helleborus argutifolius - Corsican hellebore.jpg', 113, 1),
('Helleborus foetidus - Stinking Hellebore.jpg', 114, 1),
('Helleborus orientalis - lenten rose.jpeg', 115, 1),
('Hoheria angustifolia - narrow leaved lacebark.jpg', 116, 1),
('Hoheria lyallii - mountain lacebark.jpg', 117, 1),
('Hoheria sexstylosa - lacebark or houhere.jpeg', 118, 1),
('Hydrangea macrophylla - mophead hydrangea.jpg', 119, 1),
('Hydrangea paniculata - panicled hydrangea.jpg', 120, 1),
('Hydrangea quercifolia _Pee Wee_ - oak leaf hydrangea.jpeg', 121, 1),
('Ilex aquifolium - English holly.jpg', 122, 1),
('Juncus pallidus - giant club rush.jpg', 123, 1),
('Knightia excelsa - rewarewa (NZ honeysuckle).jpg', 124, 1),
('Kunzea ericoides - kanuka.jpg', 125, 1),
('Laurus nobilis - bay tree.jpg', 126, 1),
('Lavandula X intermedia - hybrid lavender.jpeg', 127, 1),
('Leonohebe cupressoides - frangrant hebe.jpeg', 128, 1),
('Leucadendron argenteum - Silver Tree.jpg', 129, 1),
('Leucadendron salignum - conebush.jpg', 130, 1),
("Libertia ixioides - NZ iris or mikoikoi.jpg", 131, 1),
('Libertia peregrinans - NZ iris.jpg', 132, 1),
('Liquidambar styraciflua - American sweetgum.jpg', 133, 1),
('Liriodendron tulipifera - tulip tree.jpg', 134, 1),
('Lomandra longifolia - basket grass.jpeg', 135, 1),
('Lomaria discolor - crown fern.jpeg', 136, 1),
('Lophomyrtus obcordata - rohutu or NZ myrtle.jpg', 137, 1),
('Lophomyrtus x ralphii - hybrid lophomyrtus or NZ myrtle.jpg', 138, 1),
('Lophozonia menziesii - silver beech.jpg', 139, 1),
('Magnolia grandiflora _Little Gem_ - dwarf magnolia.jpg', 140, 1),
('Magnolia liliflora _Nigra_ - deciduous magnolia.jpg', 141, 1),
('Magnolia X soulangeana - saucer or Chinese magnolia.jpg', 142, 1),
('Malus sp. - apple tree.jpg', 143, 1),
('Melicytus alpinus - porcupine scrub.jpg', 144, 1),
('Melicytus lanceolatus - Narrow Leaved Mahoe.jpeg', 145, 1),
('Melicytus ramiflorus - mahoe or whiteywood.jpg', 146, 1),
('Metrosideros umbellata - Southern Rata.jpg', 147, 1),
('Michelia yunnanensis - evergreen michelia.jpg', 148, 1),
('Microleana avenacea - bush rice grass.jpg', 149, 1),
('Muehlenbeckia astonii - shrubby tororaro.jpg', 150, 1),
('Muehlenbeckia australis - pohuehue.jpg', 151, 1),
('Muehlenbeckia axillaris - creeping muehlenbeckia.jpg', 152, 1),
('Muehlenbeckia complexa - small-leaved pohuehue.jpg', 153, 1),
('Myoporum laetum - ngaio.jpg', 154, 1),
('Myosotidium hortensia - Chatham Island forget me not.jpeg', 155, 1),
('Nandina domestica ‘Pygmaea’ - dwarf heavenly bamboo.jpg', 156, 1),
('Narcissus sp. - Daffodil.jpeg', 157, 1),
('Nepeta mussinii - cat mint.jpg', 158, 1),
('Olea europaea - olive tree.jpeg', 159, 1),
('Olearia cheesemanii - NZ daisy bush.jpg', 160, 1),
('Olearia lineata - twiggy tree daisy.jpg', 161, 1),
('Olearia paniculata - Golden Akeake or Akiraho.jpg', 162, 1),
('Olearia X macrodonta - NZ or Mountain Holly.jpg', 163, 1),
('Ophiopogon planiscapus _Black Dragon_ - black mondo grass.jpg', 164, 1),
('Ozothamnus leptophylllus - Cottonwood or Tauhinu.jpg', 165, 1),
('Pachysandra terminalis - Japanese spurge.jpg', 166, 1),
('Pachystegia insignis - Malborough rock daisy.jpeg', 167, 1),
('Pachystegia rufa - Marlborough rock daisy.jpg', 168, 1),
('Pectinopitys ferruginea - miro.jpg', 169, 1),
('Phebalium squameum - satinwood.jpg', 170, 1),
('Phormium cookianum - wharariki or mountain Flax.jpg', 171, 1),
('Phormium tenax - harakeke or NZ flax.jpg', 172, 1),
('Photinia X fraseri _Robusta_ - photinia.jpg', 173, 1),
('Phyllocladus alpinus - mountain toatoa or celery pine.jpg', 174, 1),
('Phyllocladus trichomanoides - tenakaha.jpg', 175, 1),
('Pieris japonica - lily of the valley.jpg', 176, 1),
('Pimelea prostrata - NZ daphne.jpg', 177, 1),
('Piper excelsum - kawakawa.jpg', 178, 1),
('Pittosporum crassifolium - karo.jpg', 179, 1),
('Pittosporum eugenioides - lemonwood or tarata.jpg', 180, 1),
('Pittosporum patulum - Pitpat.jpg', 181, 1),
('Pittosporum tenuifolium - kohuhu or black matipo.jpg', 182, 1),
('Pittosporum tenuifolium _Sumo_ - dwarf pittosporum.jpg', 183, 1),
('Plagianthus divarivatus - swamp ribbonwood.jpeg', 184, 1),
('Plagianthus regius - lowland ribbonwood.jpeg', 185, 1),
('Platanus orientalis _Digitata_ - cut leaf plane.jpg', 186, 1),
('Platanus x acerifolia - London plane.jpg', 187, 1),
('Poa cita - silver tussock.jpeg', 188, 1),
('Podocarpus laetus - mountain or Hall_s totara.jpg', 189, 1),
('Podocarpus nivalis - snow or mountain totara.jpg', 190, 1),
('Podocarpus totara - totara.jpg', 191, 1),
('Polyspora axillaris - fried egg plant.jpeg', 192, 1),
('Polystichum vestitum - prickly shield fern or puniu.jpg', 193, 1),
('Populus trichocarpa - black cottonwood.jpeg', 194, 1),
('Pratia (syn. Lobelia) angulata - panakenake.jpeg', 195, 1),
('Protea neriifolia - oleanderleaf protea.jpg', 196, 1),
('Prumnopitys taxifolia - matai.jpg', 197, 1),
('Prunus laurocerasus - cherry laurel.jpg', 198, 1),
('Prunus lusitanica - Portuguese Cherry Laurel.jpg', 199, 1),
('Prunus x yedoensis - Yoshino cherry.jpg', 200, 1),
('Pseudopanax crassifolius - lancewood.jpg', 201, 1),
('Pseudopanax ferox - fierce lancewood.jpg', 202, 1),
('Pseudopanax lessonii - houpara.jpg', 203, 1),
('Pseudowintera colorata - horopito or pepper tree.jpg', 204, 1),
('Pyrus communis - common pear.jpg', 205, 1),
('Quercus palustris - pin oak.jpg', 206, 1),
('Quercus robur - English oak.jpg', 207, 1),
('Quercus rubra - red oak.jpg', 208, 1),
('Rhododendron sp. - azalea.jpg', 209, 1),
('Rhododendron sp. - rhododendron.jpeg', 210, 1),
('Rhopalostylis sapida - nikau palm.jpeg', 211, 1),
("Robinia pseudoacacia 'Lace Lady' - contoured black locust.jpeg", 212, 1),
('Rosa sp. _Ivey Hall_ - yellow floribunda rose.jpeg', 213, 1),
('Rosmarinus officinalis - rosemary.jpg', 214, 1),
('Rubus cissoides - bush lawyer.jpg', 215, 1),
('Salvia officinalis - common sage.jpeg', 216, 1),
('Santolina chamaecyparissus - lavender cotton.jpg', 217, 1),
('Sarcococca confusa - sweet box.jpg', 218, 1),
('Scleranthus biflorus - knawel cushion or cushion plant.jpg', 219, 1),
('Sedum spectabile _Autumn Joy_ - stonecrop.jpg', 220, 1),
('Sequoia sempervirens - redwood.jpg', 221, 1),
("Skimmia japonica - Japanese skimmia.jpg", 222, 1),
('Solanum laciniatum - poroporo.jpg', 223, 1),
('Sophora microphylla - South Island kowhai.jpg', 224, 1),
('Sophora molloyi _Dragons Gold_ - Cook Strait kowhai.jpg', 225, 1),
('Sophora prostrata - prostrate kowhai.jpg', 226, 1),
('Sophora tetraptera - North Island kowhai.jpg', 227, 1),
('Sorbus aucuparia - rowan.jpg', 228, 1),
('Teucridium parvifolium - teucridium.jpg', 229, 1),
('Tilia cordata - lime tree.jpeg', 230, 1),
('Tilia vulgaris - Lime Tree.jpg', 231, 1),
("Trachycarpus fortunei - Chinese Windmill Palm.jpg", 232, 1),
('Typha orientalis - raupo or bullrush.jpg', 233, 1),
('Ulmus carpinifolia _Variegata_ - variegated elm.jpg', 234, 1),
('Veronica _Emerald Green_ - Whipcord Hebe.jpg', 235, 1),
('Veronica hulkeana - New Zeland lilac.jpeg', 236, 1),
('Veronica odora _Prostrata_ - prostrate hebe.jpg', 237, 1),
('Veronica salicifolia - Koromiko.jpg', 238, 1),
('Veronica sp. _Wiri MIst_ - wiri mist hebe.jpeg', 239, 1),
('Veronica speciosa  - large leaved hebe.jpg', 240, 1),
('Veronica topiaria - topiary hebe.jpg', 241, 1),
('Viburnum japonicum - Japanese Viburnum.jpg', 242, 1),
('Viburnum tinus - laurustinus.jpg', 243, 1),
('Wisteria sinensis - Chinese wisteria.jpg', 244, 1),
('Zantedeschia aethiopica - arum or calla Lily.jpeg', 245, 1);

INSERT INTO product_type (type_name, is_active) VALUES
('Plant', 1),
('Ground', 1),
('Other', 1);

INSERT INTO product (product_name, product_type, price, picture, is_active) VALUES
('Agapanthus africanus', 1, 100, 'Agapanthus_africanus.png', 1),
('Aguilegia', 1, 100, 'Aguilegia.png', 1),
('Argyranthemum frutescens', 1, 100, 'Argyranthemum_frutescens.png', 1),
('Astilbe chinensis', 1, 100, 'Astilbe_chinensis.png', 1),
('Bougainvillea', 1, 100, 'Bougainvillea.png', 1),
('Bridal Wreath', 1, 100, 'Bridal_Wreath.png', 1),
('Campanula medium -- blue', 1, 100, 'Campanula_medium_--_blue.png', 1),
('Campanula medium -- pink', 1, 100, 'Campanula_medium_--_pink.png', 1),
('Campanula punctata Lam', 1, 100, 'Campanula_punctata_Lam.png', 1),
('Cyclamen persicum', 1, 100, 'Cyclamen_persicum.png', 1),
('Dahlia pinnata Cav', 1, 100, 'Dahlia_pinnata_Cav.png', 1),
('Delphinium', 1, 100, 'Delphinium.png', 1),
('Digitalis purpurea', 1, 100, 'Digitalis_purpurea.png', 1),
('Elephant Ears', 1, 100, 'Elephant_Ears.png', 1),
('Eupatorium fortunei', 1, 100, 'Eupatorium_fortunei.png', 1),
('Evening Primrose', 1, 100, 'Evening_Primrose.png', 1),
('Golden Foster Holly', 1, 100, 'Golden_Foster_Holly.png', 1),
('Hamamelis mollis', 1, 100, 'Hamamelis_mollis.png', 1),
('Helichrysum petiolare', 1, 100, 'Helichrysum_petiolare.png', 1),
('Hydrangea macrophylla', 1, 100, 'Hydrangea_macrophylla.png', 1),
('Ipomoea nil', 1, 100, 'Ipomoea_nil.png', 1),
('Lamprocapnos spectabilis', 1, 100, 'Lamprocapnos_spectabilis.png', 1),
('Lavender', 1, 100, 'Lavender.png', 1),
('Lily', 1, 100, 'Lily.png', 1),
('Lupinus', 1, 100, 'Lupinus.png', 1),
('Maple', 1, 100, 'Maple.png', 1),
('Matteuccia struthiopteris', 1, 100, 'Matteuccia_struthiopteris.png', 1),
('Myosotis', 1, 100, 'Myosotis.png', 1),
('Parthenocissus tricuspidata', 1, 100, 'Parthenocissus_tricuspidata.png', 1),
('Pelargonium hortorum Bailey', 1, 100, 'Pelargonium_hortorum_Bailey.png', 1),
('Phlox drummondii', 1, 100, 'Phlox_drummondii.png', 1),
('Purple coneflower', 1, 100, 'Purple_coneflower.png', 1),
('Rainlily', 1, 100, 'Rainlily.png', 1),
('Salvia japonica', 1, 100, 'Salvia_japonica.png', 1),
('Stipa capillata', 1, 100, 'Stipa_capillata.png', 1),
('Strelitzia reginae', 1, 100, 'Strelitzia_reginae.png', 1),
('Tulip', 1, 100, 'Tulip.png', 1),
('Verbena officinalis', 1, 100, 'Verbena_officinalis.png', 1),
('Viburnum hanceanum Maxim', 1, 100, 'Viburnum_hanceanum_Maxim.png', 1),
('Vitex agnus-castus', 1, 100, 'Vitex_agnus-castus.png', 1),
('Grass', 2, 100, 'grass.jpg', 1),
('Road', 2, 100, 'road.jpg', 1),
('Water', 2, 100, 'water.jpg', 1);
