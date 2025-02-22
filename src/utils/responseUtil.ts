export class SendResponse {
  "200" = (res, data = null, error = null) => {
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Operation Successfull",
      data: data,
      error: error,
    });
  };
  "404" = (res, message, data = null, error = null) => {
    res.status(404).json({
      success: false,
      statusCode: 404,
      message,
      data: data,
      error: error,
    });
  };
  "500" = (res, error = null) => {
    res.status(500).json({
      success: false,
      statusCode: 404,
      message: "Operation Failed",
      data: null,
      error: error,
    });
  };
}
