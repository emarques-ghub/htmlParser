function extraiProximaLinha(posicaoAtual, arquivoOrigem) {
  var linha = "";
  for(var i=posicaoAtual; i < arquivoOrigem.length; i++) {
    if(arquivoOrigem[i] == "\n") { 
      return [i, linha]
    }
    else {
      linha = linha + arquivoOrigem[i];
    }
  }
  return [i, linha]
}

let ul = document.getElementById("items");
let items = document.getElementsByTagName("li");

function criarElemento(input){
  let li = document.createElement("li");
  let text = document.createTextNode(input);
  li.appendChild(text);
  ul.appendChild(li);
}

document.getElementById('fileInput').addEventListener('change', function selectedFileChanged() {
  if (this.files.length === 0) {
    console.log('No file selected.');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function fileReadCompleted() { 
    let retorno = [-1,""];
    let linha = "";
    var rg_data = /^([0-3][0-9]\/[0-1][0-9])$/
    var rg_data_memo = /^([0-3][0-9]\/[0-1][0-9]) /
    var rg_valor = /(- )?(\d+\.)?\d+(\,\d{1,2})/
    var rg_nbsp = /&nbsp;/
    var transacao = {data: "", memo: "", valor: "", parcela: ""}
    var resultado = ""
    var soma = 0

    do {
      retorno = extraiProximaLinha(retorno[0]+1, reader.result);
      //linha = retorno[1].replace("<NOBR>", "").replace("</NOBR>", "")//.replace("&nbsp;", "")

      if (/(<TR>)/.test(retorno[1])) {
        transacao = {data: "", memo: "", valor: "", parcela: ""}         //}
        while (true) {
            retorno = extraiProximaLinha(retorno[0]+1, reader.result);
            retorno[1] = retorno[1].replace("<NOBR>", "").replace("</NOBR>", "").replace("<SPAN>", "").replace("</SPAN>", "")

            if (/(<\/TR>)/.test(retorno[1]) || retorno[0] >= reader.result.length)
                break;
            else {

                if ( /<TD(.*)<\/TD>/.test(retorno[1]) && /(">)([^<>].*)(<\/P>)/.test(retorno[1])) {
                    linha = /(">)([^<>].*)(<\/P>)/.exec(retorno[1])[0].replace('">', "").replace("</P>", "")

                    if (rg_data.test(linha))  {
                        if (transacao.data == "") 
                          transacao.data = linha
                        else {
                          transacao.memo = transacao.memo + linha
                          if (/([0-3][0-9]\/[0-1][0-9])/.test(transacao.memo))
                            transacao.parcela = /([0-3][0-9]\/[0-1][0-9])/.exec(transacao.memo)[0]
                        }
                    }
                    else if (rg_valor.test(linha)) {
                        transacao.valor = linha 
                    }
                    else if (rg_data_memo.test(linha)) {
                        transacao.data = linha.substr(0, 5)
                        transacao.memo = linha.substr(6)
                        if (/([0-3][0-9]\/[0-1][0-9])/.test(transacao.memo))
                          transacao.parcela = /([0-3][0-9]\/[0-1][0-9])/.exec(transacao.memo)[0]
                    }
                    else if (rg_nbsp.test(linha)) {
                    }
                    else { 
                        transacao.memo = linha
                        if (/([0-3][0-9]\/[0-1][0-9])/.test(transacao.memo))
                          transacao.parcela = /([0-3][0-9]\/[0-1][0-9])/.exec(transacao.memo)[0]
                    }
                  }
            }
        }
      
        if (/Total desta fatura/.test(transacao.memo)) {
          resumo = transacao.valor
        }

        /*
        if (/Compras parceladas - pr(.*)imas faturas/.test(transacao.memo)) {
          criarElemento("Total Fatura:" + resumo + "Total Lido:" + soma)
          criarElemento(transacao.data + " | " + transacao.memo + " | " + transacao.valor + " | " + transacao.parcela)
          soma = 0 
        }*/

        if (transacao.data != "" && transacao.memo != "" && transacao.valor != "") {
            soma = soma + parseFloat(transacao.valor.replace("- ", "-").replace("." , "").replace("," , "."))
            criarElemento(transacao.data + " | " + transacao.memo + " | " + transacao.valor + " | " + transacao.parcela + " | " + soma.toFixed(2)) 
          }

      }

      if (/Compras parceladas - pr(.*)imas faturas/.test(retorno[1])) {
        criarElemento("Total Fatura:" + resumo + "Total Lido:" + soma)
        criarElemento("\nCompras parceladas - proximas faturas")
        resumo = 0
        soma = 0 
      }

    } while (retorno[0] < reader.result.length);  
    criarElemento("Total Fatura:" + resumo + "Total Lido:" + soma)
  };
  reader.readAsText(this.files[0]);
});
   






