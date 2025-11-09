from flask import Flask, request, jsonify
from flask_cors import CORS
from feedback import generate_feedback, extract_website_text
import json
app=Flask(__name__)
CORS(app)
@app.route('/api/feedback', methods=['POST'])
def feedback():
    try:
        data=request.get_json()
        url=data.get("webUrl")
        email=data.get("userEmail")

        if not url:
            return json({"error: website req"}),400
        
        content=extract_website_text(url)
        raw_res=generate_feedback(content)
        feedback_json=json.loads(raw_res)
        return jsonify({data:feedback_json})
    except Exception as e:
        print("Error",str(e))
        return jsonify({"error":"failed to generate feedback"}),500
if __name__=="__main__":
    app.run(port=5000,debug=True)

