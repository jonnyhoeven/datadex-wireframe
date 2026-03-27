FROM emacski/tensorflow-serving:latest
COPY tf_serving_models /models/
EXPOSE 8501
CMD ["tensorflow_model_server", "--rest_api_port=8501", "--model_name=activity_predictor", "--model_base_path=/models/activity_predictor"]