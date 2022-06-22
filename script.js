var maxIteracoes = 200;


var gaussSeidel = {
  valoresX: [],
  
  testarConvergencia: function(A) {
    // sassefield
    var somaLinha, b = new Array(A.length).fill(1);
    for (var i=0 ; i<A.length ; i++) {
      somaLinha = 0;
      for (var j=0 ; j<A[i].length ; j++) {
        if (j !== i)
          somaLinha += (Math.abs(A[i][j]) * b[j]);
      }
      if ((somaLinha/A[i][i]) >= 1)
        return false;
      else
        b[i] = somaLinha/A[i][i];
    }
    return true;
  },
  
  aplicar: function(A, b, x0, e) {
    this.valoresX = [];
    this.valoresX.unshift(x0.slice());
    var tempX = this.valoresX[0].slice(), numIteracoes = 0;
    do {
      for (var i=0 ; i<A.length ; i++) {
        tempX[i] = b[i];
        for (var j=0 ; j<A.length ; j++) {
          if (j !== i) tempX[i] -= (A[i][j] * tempX[j]);
        }
        tempX[i] /= A[i][i];
      }
      this.valoresX.unshift(tempX.slice());
      numIteracoes++;
      if(numIteracoes >= 200) {
        break;
      }
    } while(!checarPrecisao(e[0], this.valoresX[0], this.valoresX[1]));
    updatePanel("gs", this.valoresX, numIteracoes, e, this.testarConvergencia(A));
  }
};

function checarPrecisao(e, arr1, arr2) {
  if(arr1.length === arr2.length) {
    for (var i=0 ; i<arr1.length ; i++) {
      if (Math.abs(arr1[i] - arr2[i]) >= e)
        return false;
    }
    return true;
  }
}

function updatePanel(name, valores, num, e, conv) {
  $("#" + name + "-aprox").html(formatarVetor(valores[0], e[1] + 1));
  $("#" + name + "-numI").html(num);
  if (conv) {
    $("#" + name + "-conv");
    $("#" + name + "-conv").html("Convergiu");
  } else {
    $("#" + name + "-conv");
    $("#" + name + "-conv").html("Não convergiu");
  }

  $("#" + name + "-seq").html("");
  for (var i=1 ; i<valores.length ; i++) {
    $("#" + name + "-seq").append(i + "ª iteração:\n");
    $("#" + name + "-seq").append(formatarVetor(valores[valores.length-i-1], e[1] + 1));
    $("#" + name + "-seq").append(((i === valores.length-1) ? "" : "\n"));
  }
}

function formatarVetor(arr, casas) {
  var str = "[";
  for (var i=0 ; i<arr.length ; i++) {
    if (i > 0) str += " , ";
    str += arr[i].toFixed(casas);
  }
  str += ((arr.length > 0) ? "]" : " ]");
  return str;
}

$("document").ready(function() {
  $("#btn-calcular").click(function() {

    var A = $("#in-matriz").val().split("\n");
    for(var i=0 ; i<A.length ; i++) {
      A[i] = A[i].split(" ");
      A[i].forEach(function(val, j, arr) {
        arr[j] = parseFloat(arr[j]);
      });
    }

    var b = $("#in-b").val().split(" ");
    for(var i=0 ; i<b.length ; i++) {
      b[i] = parseFloat(b[i]);
    }

    var x0 = $("#in-x0").val().split(" ");
    for(var i=0 ; i<x0.length ; i++) {
      x0[i] = parseFloat(x0[i]);
    }

    var e = [0, 0];
    e[0] = parseFloat($("#in-e").val());
    e[1] = $("#in-e").val().split(".")[1].length;
    

    gaussSeidel.aplicar(A, b, x0, e);
  });
});