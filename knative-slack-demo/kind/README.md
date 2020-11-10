# Setup Kind

Install Serving

1. kind create cluster --name knative --config kind/clusterconfig.yaml
1. kc apply -f https://github.com/knative/serving/releases/download/v0.17.2/serving-crds.yaml
1. kc apply -f https://github.com/knative/serving/releases/download/v0.17.2/serving-crds.yaml
1. kc apply -f kind/kourier.yaml
1. kubectl patch configmap/config-network \
  --namespace knative-serving \
  --type merge \
  --patch '{"data":{"ingress.class":"kourier.ingress.networking.knative.dev"}}'
1. kubectl patch configmap/config-domain \
  --namespace knative-serving \
  --type merge \
  --patch '{"data":{"127.0.0.1.nip.io":""}}'

Install Strimzi

1. kubectl create namespace kafka
1. kubectl apply -f 'https://strimzi.io/install/latest?namespace=kafka' -n kafka
1. kubectl apply -f https://strimzi.io/examples/latest/kafka/kafka-persistent-single.yaml -n kafka

Install Eventing

1. kc apply -f https://github.com/knative/eventing/releases/download/v0.17.3/eventing-crds.yaml
1. kc apply -f https://github.com/knative/eventing/releases/download/v0.17.3/eventing-crds.yaml

Install Kafka Channels

1. curl -L "https://github.com/knative/eventing-contrib/releases/download/v0.17.1/kafka-channel.yaml" \
 | sed 's/REPLACE_WITH_CLUSTER_URL/my-cluster-kafka-bootstrap.kafka:9092/' \
 | kubectl apply --filename -
1. kubectl apply --filename https://github.com/knative-sandbox/eventing-kafka-broker/releases/download/v0.17.0/eventing-kafka-broker.yaml

Install Sources

1. kubectl apply --filename https://github.com/knative/eventing-contrib/releases/download/v0.17.1/kafka-source.yaml