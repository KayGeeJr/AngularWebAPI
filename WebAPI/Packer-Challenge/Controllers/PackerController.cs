using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using Packer_Challenge.Models;
using Packer_Challenge.Exceptions;

namespace PackerAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PackerController : ControllerBase
    {
        // HTTP GET action method to retrieve input data from a file
        [HttpGet("inputData")]
        public IActionResult GetInputData(string filePath = "example_input.txt")
        {
            try
            {
                // Check if the specified file exists
                if (!System.IO.File.Exists(filePath))
                {
                    throw new APIException($"File not found: {filePath}");
                }

                // Read all lines from the file
                var lines = System.IO.File.ReadAllLines(filePath);

                // Return the lines as the response
                return Ok(lines);
            }
            catch (APIException ex)
            {
                // Return a BadRequest response if an APIException occurs
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                // Return a 500 Internal Server Error response for other exceptions
                return StatusCode(500, ex.Message);
            }
        }

        // Constants for maximum weight, items, and item weight/cost
        private const int MaxWeightLimit = 100;
        private const int MaxItemsLimit = 15;
        private const int MaxItemWeightCost = 100;

        // HTTP GET action method for packing items
        [HttpGet]
        public string Pack(string filePath = "example_input.txt")
        {
            // Check if the specified file exists
            if (!System.IO.File.Exists(filePath))
            {
                throw new APIException($"File not found: {filePath}");
            }

            // Read all lines from the file
            var lines = System.IO.File.ReadAllLines(filePath);
            var result = new List<string>();

            // Process each line of the input
            foreach (var line in lines)
            {
                var parts = line.Split(':');

                // Check if the line has the correct format
                if (parts.Length != 2)
                {
                    throw new APIException($"Invalid input format: {line}");
                }

                var maxWeightString = parts[0].Trim();

                // Parse the maximum weight value from the input
                if (!int.TryParse(maxWeightString, out int maxWeight) || maxWeight > MaxWeightLimit)
                {
                    throw new APIException($"Invalid max weight value: {maxWeightString}");
                }

                var itemsString = parts[1].Trim();

                // Check if the items section has the correct format
                if (!itemsString.StartsWith("(") || !itemsString.EndsWith(")"))
                {
                    throw new APIException($"Invalid items format: {itemsString}");
                }

                // Parse the items from the input
                var items = ParseItems(itemsString);

                // Check if the number of items exceeds the limit
                if (items.Count > MaxItemsLimit)
                {
                    throw new APIException($"Number of items exceeds the limit: {items.Count}");
                }

                // Validate the weight and cost values of each item
                foreach (var item in items)
                {
                    if (item.Weight > MaxItemWeightCost || item.Cost > MaxItemWeightCost)
                    {
                        throw new APIException($"Invalid item weight or cost value: {item.Weight}, {item.Cost}");
                    }
                }

                // Get the best combination of items within the weight limit and add it to the result
                var bestCombination = GetBestCombinationAsString(maxWeight, items);
                result.Add(bestCombination);
            }

            // Return the result as a string joined by new lines
            return string.Join(Environment.NewLine, result);
        }

        // Parse the items from the input string
        private static List<Item> ParseItems(string input)
        {
            var items = new List<Item>();

            var itemStrings = input.Split('(', ')', ',');
            for (var i = 1; i < itemStrings.Length; i += 4)
            {
                var index = int.Parse(itemStrings[i]);

                // Parse the weight value as a double
                if (double.TryParse(itemStrings[i + 1], NumberStyles.Any, CultureInfo.InvariantCulture, out double weight))
                {
                    var costString = itemStrings[i + 2].Trim('€');

                    // Parse the cost value as a double
                    if (double.TryParse(costString, NumberStyles.Any, CultureInfo.InvariantCulture, out double cost))
                    {
                        items.Add(new Item { Index = index, Weight = weight, Cost = cost });
                    }
                    else
                    {
                        throw new APIException($"Invalid cost value: {costString}");
                    }
                }
                else
                {
                    throw new APIException($"Invalid weight value: {itemStrings[i + 1]}");
                }
            }

            return items;
        }

        // Get the best combination of items within the weight limit and return it as a string
        private static string GetBestCombinationAsString(int maxWeight, List<Item> items)
        {
            var n = items.Count + 1;
            var w = maxWeight + 1;
            var a = new double[n, w];

            // Use dynamic programming to calculate the best combination
            for (var i = 1; i < n; i++)
            {
                var item = items[i - 1];

                for (var j = 1; j < w; j++)
                {
                    if (item.Weight > j)
                    {
                        a[i, j] = a[i - 1, j];
                    }
                    else
                    {
                        a[i, j] = Math.Max(a[i - 1, j], a[i - 1, j - (int)item.Weight] + item.Cost);
                    }
                }
            }

            var indexes = new List<int>();
            var mw = maxWeight;
            var totalCost = a[n - 1, w - 1];
            for (; mw > 0 && a[n - 1, mw - 1] == totalCost; mw--) ;

            // Backtrack to find the items in the best combination
            for (var i = n - 1; i > 0; i--)
            {
                if (a[i, mw] != a[i - 1, mw])
                {
                    indexes.Add(items[i - 1].Index);
                    mw -= (int)items[i - 1].Weight;
                }
            }

            var sortedIndexes = indexes.OrderBy(i => i);
            var result = string.Join(",", sortedIndexes);

            // If no items are selected, return '-'
            return result.Length == 0 ? "-" : result;
        }
    }
}
