var maxProfit = function(prices) {
    let minPrice = prices[0];
    console.log("minprice",minPrice)
    let maxProfit = 0;
    console.log("maxProfit",maxProfit)


    for (let i = 1; i < prices.length; i++) {

        // Update minimum price
        if (prices[i] < minPrice) {

            minPrice = prices[i];
        }

        // Calculate today's profit
        let profit = prices[i] - minPrice;

        // Update maximum profit
        if (profit > maxProfit) {
            maxProfit = profit;
        }
    }

    return maxProfit;
};

let prices = [7,1,5,3,6,4]
console.log(maxProfit(prices))
console.log(-6 > 0)