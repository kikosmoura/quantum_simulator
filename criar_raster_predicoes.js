// Supondo que o CSV tenha sido carregado como um asset chamado "users/seu_usuario/seu_csv_asset"
// Certifique-se de que o asset possua a coluna de geometria configurada corretamente.
var pontos = ee.FeatureCollection("projects/ee-kikosmoura/assets/quantum_prediction");

// Converte as predições dos pontos em uma imagem.
// Aqui usamos o reducer "first" para extrair o valor da propriedade 'prediction' para cada pixel.
var imagemPred = pontos.reduceToImage({
  properties: ['prediction'],
  reducer: ee.Reducer.first()
});

// Define o sistema de projeção e escala desejada (10 metros).
// Se os dados estiverem em coordenadas geográficas, considere reprojetá-los para um sistema projetado (ex.: UTM).
var proj = imagemPred.projection();
var imagemReprojetada = imagemPred.reproject({
  crs: proj,
  scale: 10
});

// Visualiza a imagem no mapa (opcional)
Map.centerObject(pontos, 14);
Map.addLayer(imagemReprojetada, {min: 0, max: 2, palette: ['blue', 'green', 'red']}, 'Predictions');

// Exporta a imagem para o Google Drive
Export.image.toDrive({
  image: imagemReprojetada,
  description: 'RasterPredictions',
  scale: 10,
  region: pontos.geometry().bounds(),
  maxPixels: 1e13
});
