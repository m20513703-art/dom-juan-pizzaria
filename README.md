# Dom Juan Pizzaria — demonstração de site e PDV

Projeto fictício para apresentar um modelo de site/cardápio e atendimento no PDV. Sabores, preços, horários, endereço, telefone, imagens e pedidos são ilustrativos; confirme os dados autorizados pelo cliente antes de personalizar ou divulgar.

## Arquivos principais
- `index.html`: site e cardápio para clientes.
- `pdv.html`: painel demonstrativo da operação.
- `script.js` e `pdv.js`: montagem de pedidos, histórico, edição do cardápio e sincronização local.
- `styles.css` e `pdv.css`: aparência responsiva.
- `pizza-01.jpg` a `pizza-15.jpg` e `storefront.jpg`: imagens ilustrativas, substituíveis por fotos autorizadas.

## Como testar
No Windows, com Python instalado, execute `Iniciar-Demo-Windows.bat` para abrir o site e o PDV no mesmo navegador. Também é possível iniciar `python -m http.server 8000` nesta pasta e acessar `http://localhost:8000/` e `http://localhost:8000/pdv.html`.

1. Monte uma pizza, adicione uma bebida e preencha dados de teste no site.
2. Envie o pedido: ele deve aparecer como **Novo** no PDV.
3. Avance o pedido por preparo, pronto e concluído; o histórico do site acompanha o status.
4. Edite produtos, categorias, preços, ingredientes, disponibilidade e fotos no PDV; o cardápio do site sincroniza no mesmo navegador.

## Limites da demonstração
A sincronização usa `localStorage`: funciona só no mesmo navegador/dispositivo e na mesma origem (por exemplo, as duas páginas abertas em `localhost` ou no mesmo domínio publicado). Não há servidor, banco de dados, conta de cliente, backup, pagamento ou pedido real. Limpar os dados do navegador apaga os pedidos e alterações locais. Não usar para operação comercial.

O horário demonstrativo está configurado para todos os dias, das 8h às 23h, no fuso de São Paulo; fora desse período, o site bloqueia o cardápio e os pedidos. As fotos, contatos e demais dados devem ser substituídos por informações confirmadas e aprovadas pelo cliente antes da publicação.
