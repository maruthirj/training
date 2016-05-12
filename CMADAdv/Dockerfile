# Extend vert.x image
FROM vertx/vertx3

#                                                       
ENV VERTICLE_NAME com.mydomain.deposit.CustomerClassificationVerticle
ENV VERTICLE_FILE target/CustomerClassification-1.0.jar

COPY ./logging.properties $VERTICLE_HOME/
ENV VERTX_JUL_CONFIG $VERTICLE_HOME/logging.properties

# Set the location of the verticles
ENV VERTICLE_HOME /usr/verticles

EXPOSE 8080

# Copy your verticle to the container                   
COPY $VERTICLE_FILE $VERTICLE_HOME/

# Launch the verticle
WORKDIR $VERTICLE_HOME
ENTRYPOINT ["sh", "-c"]
CMD ["vertx run $VERTICLE_NAME -cp $VERTICLE_HOME/* -cluster"]
