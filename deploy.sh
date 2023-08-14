set -e
npm run build
cd dist
git init
git add .
git commit -m 'deploy'
git push -f https://github.com/Rayyyyyyyyyyyyyyyyyyyy/vite-games.git master:main
cd -
