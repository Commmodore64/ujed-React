echo "Cambiando a la rama main"
git checkout main

echo "Construyendo plataforma"
npm run build

echo "Desplegando archivos en el servidor..."
scp -r build/* contabilidad-faeo@200.23.125.118:/var/www/200.23.124.118/

echo "Desplegado exitoso!"