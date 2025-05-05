export const calcularMediaEAvaliacoes = (ratingsData: { [key: number]: number }) => {
    const total = Object.values(ratingsData).reduce((sum, val) => sum + val, 0);
    
    const weightedSum = Object.entries(ratingsData).reduce(
      (sum, [rating, count]) => sum + Number(rating) * count,
      0
    );
    
    const average = total > 0 ? (weightedSum / total).toFixed(1) : "0.0";
  
    const formatNumber = (num: number) => {
      if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(".0", "") + "M";
      if (num >= 1_000) return (num / 1_000).toFixed(1).replace(".0", "") + "k";
      return num.toString();
    };
  
    return {
      average,
      total,
      formattedTotal: formatNumber(total),
      ratingsData,  
    };
  };