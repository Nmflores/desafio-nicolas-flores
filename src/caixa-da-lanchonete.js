import fs from 'fs';
const m_json = JSON.parse(fs.readFileSync('./arquivos/cardapio.json'));
const metodoPagamento = JSON.parse(fs.readFileSync('./arquivos/tipoPagamentos.json'));

class CaixaDaLanchonete {

    calcularValorDaCompra(metodoDePagamento, itens) {
        let transf = null;
        let soma  = 0;
        let temCafe = false;
        let temSanduiche = false;

        //Se itens estiver vazio retorna a mensagem
        if(itens.length == 0 ){
            console.log("Não há itens no carrinho de compra!");
            return "Não há itens no carrinho de compra!";            
        }
        //Se o metodo de pagamento não existe no arquivo json retorna a mensagem
        if(verificaMetodo(metodoDePagamento)){
            console.log("Forma de pagamento inválida!");
            return "Forma de pagamento inválida!";
        }
     //O loop está sendo usado para separar os valores de itens,colocando os codigos dos produtos em transf[0] e a quantidade em transf[1]
        for(let i = 0;i<itens.length;i++){
            transf = itens[i].split(',');
             //Verifica se o codigo existe no arquivo json
             if(verificaCodigo(transf[0])){
                console.log("Item inválido!");
                return "Item inválido!";
            }
            //Se quantidade for vazia retorna quantidade invalida
            if(transf[1].includes('0')){
                console.log("Quantidade inválida!");
                return "Quantidade inválida!";
            }
           
           //Se codigo for cafe o chantily pode ser adicionado e se for sanduiche o queijo pode ser adicionado
            if(transf[0] == "cafe" ){
                temCafe = true;
            } else if(transf[0] == "sanduiche" ){
                temSanduiche = true;
            } else if(transf[0] == "chantily" && temCafe == false){
                console.log("Item extra não pode ser pedido sem o principal");
                return "Item extra não pode ser pedido sem o principal";      
            } else if(transf[0] == "queijo" && temSanduiche == false){
                console.log("Item extra não pode ser pedido sem o principal");
                return "Item extra não pode ser pedido sem o principal"; 
            }

            // Calcula o valor e adiciona 
            soma = soma + calculaItem(metodoDePagamento, transf[0], transf[1]);

        }

        let texto = soma.toFixed(2);
        let total = "R$ " + texto.replace('.',',');
        console.log(total);
        
        return total;
           
        
    }
               
   

}

function calculaItem(metodo,codigo,quantidade){
    let modificacao = 0;
    //Vasculha o arquivo json para descobri a modificação que será feita no total
    for(let i in metodoPagamento.tipos){
        if(metodo == metodoPagamento.tipos[i].nome){
            modificacao = metodoPagamento.tipos[i].modificacao;
            
        }
    }
    //Vasculha o arquivo json para achar o codigo
    for(let i in m_json.cardapio){
        if(codigo == m_json.cardapio[i].codigo){
            let valor = parseFloat(m_json.cardapio[i].valor.replace(',','.')).toFixed(2);
            let transformador = Number(valor);
            let total = 0;
            if(metodo == 'dinheiro'){
                let desconto = transformador * (modificacao/100);
                total = (transformador - desconto) * quantidade;
                return total;
            }

            if(metodo == 'credito'){
                let acrescimo = transformador * (modificacao/100);
                total = (transformador + acrescimo) * quantidade;
                return total;
            }

            total = transformador * quantidade
           
        
            return total;
            
       }
    }


        
}

function verificaCodigo(codigo){
    for(let i in m_json.cardapio){
        if(codigo == m_json.cardapio[i].codigo){
            return false;
        }
    }
    return true;
}

function verificaMetodo(metodo){
    for(let i in metodoPagamento.tipos){
        if(metodo == metodoPagamento.tipos[i].nome){
            return false
        }

    }
    return true;
} 
    
new CaixaDaLanchonete().calcularValorDaCompra('debito','sanduiche,1','suco,2');
export { CaixaDaLanchonete }
