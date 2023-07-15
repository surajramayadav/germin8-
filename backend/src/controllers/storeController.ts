
import { Request, Response, NextFunction } from 'express';
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/errorHandler";
import storeModel from '../models/storeModel';
import startBrowser from './scrapper/city';
import cityData from './scrapper/getCityData';
import getAllAddress from './scrapper/getFullData';


// Get All City In Your Country
const getAllCity = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {

    // checking city data is present or not 
    let result: any = await storeModel.find();

    // if city data is not present the calling scrapper and save this data in my db
    if (result.length == 0) {
      const cityData = await startBrowser()
      result = await storeModel.insertMany(cityData)
    }

    // sending the city data
    res.status(200).json({
      success: true,
      data: result,
    });


  } catch (error) {

    return next(new ErrorHandler(error.message, 500));
  }
});



// Get selected City Data
const selectedCity = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const city_name = req.params.city_name

    // get data from db
    let result = await storeModel.find({ name: city_name })
    console.log(result)

    if (result.length == 0) {
      return next(new ErrorHandler("city not found", 400));
    }

    // checking data is exits or not
    if (result[0]?.location?.length == 0) {
      // scrape data using city name
      const data = await cityData(city_name)
      console.log(data)

      result[0] = await storeModel.findByIdAndUpdate(result[0]?.id, { $set: { location: data } }, {
        new: true,
        runValidators: true,
        userFindAndModify: false,
      })
    }

    // sending the city data
    res.status(200).json({
      success: true,
      data: result,
    });


  } catch (error) {

    return next(new ErrorHandler(error.message, 500));
  }
});




// Get selected City Data
const getFullData = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { city_name, land_mark } = req.body
    // // get data from db
    let result = await storeModel.find({ name: city_name })
    console.log(result)

    if (result.length == 0) {
      return next(new ErrorHandler("store not found", 400));
    }

    if (result[0]?.address) {
      // checking data is exits or not
      if (result[0]?.location?.length == 0) {
        return next(new ErrorHandler("store not found", 400));
      }

      const cityData: any = result[0]?.location?.filter((e: any) => e.address == land_mark)

      console.log("city data", cityData)
      const getAddress = await getAllAddress(cityData[0]?.url)


      if (!getAddress) {
        return next(new ErrorHandler("store address not found", 400));
      }

      result[0] = await storeModel.findByIdAndUpdate(result[0]?.id, { $set: { address: getAddress } }, {
        new: true,
        runValidators: true,
        userFindAndModify: false,
      })

    }


    // sending the city data
    res.status(200).json({
      success: true,
      data: result,
    });


  } catch (error) {

    return next(new ErrorHandler(error.message, 500));
  }
});





export { getAllCity, selectedCity, getFullData }


