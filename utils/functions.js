exports.getTimeRemaining = function getTimeRemaining(endtime){
    const total = Date.parse(endtime) - Date.parse(new Date());
    const seconds = Math.floor( (total/1000) % 60 );
    const minutes = Math.floor( (total/1000/60) % 60 );
    const hours = Math. floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const days = Math.floor( total/(10006060*24) );
  
    return {
      total,
      days,
      hours,
      minutes,
      seconds
    };
  };

  exports.format = function format(amount, decimalCount = 0, decimal = '.', thousands = ',') {
    try {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
  
      const negativeSign = amount < 0 ? '-' : '';
  
      const i = parseInt(
        (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
      ).toString();
      const j = i.length > 3 ? i.length % 3 : 0;
  
      return (
        negativeSign +
        (j ? i.substr(0, j) + thousands : '') +
        i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) +
        (decimalCount
          ? decimal +
          Math.abs(amount - i)
            .toFixed(decimalCount)
            .slice(2)
          : '')
      );
    } catch (e) {
      console.log(e);
    }
  };