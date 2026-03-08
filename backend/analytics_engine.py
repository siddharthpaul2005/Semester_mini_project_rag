from collections import defaultdict

topic_scores = defaultdict(list)

def store_result(topic, score):

    topic_scores[topic].append(score)

    avg = sum(topic_scores[topic]) / len(topic_scores[topic])

    return {
        "topic": topic,
        "attempts": len(topic_scores[topic]),
        "average_score": avg
    }


def get_analytics():

    result = {}

    for topic, scores in topic_scores.items():

        result[topic] = {
            "attempts": len(scores),
            "average_score": sum(scores)/len(scores)
        }

    return result