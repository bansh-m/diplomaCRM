from flask import Flask, request, jsonify
import pandas as pd
from pymongo import MongoClient
from bson import ObjectId
from sklearn.linear_model import LinearRegression, LogisticRegression
from datetime import datetime, timedelta
import joblib
import io
import bson

app = Flask(__name__)

client = MongoClient("mongodb://localhost:27017/")
db = client['crmDB']
booking_collection = db['bookings']
schedule_collection = db['schedules']
model_collection = db['models']

linear_model = None
logistic_model = None

def save_model(model, model_name, room_id):
    model_bytes = io.BytesIO()
    joblib.dump(model, model_bytes)
    model_bytes.seek(0)
    model_bson = bson.Binary(model_bytes.read())
    model_collection.update_one(
        {'model_name': model_name, 'room_id': room_id},
        {'$set': {'model': model_bson}},
        upsert=True
    )

def load_model(model_name, room_id):
    model_data = model_collection.find_one({'model_name': model_name, 'room_id': room_id})
    if model_data:
        model_bytes = io.BytesIO(model_data['model'])
        return joblib.load(model_bytes)
    return None

def get_day_of_week(date):
    return date.weekday()

def get_minutes_from_start_of_day(time_slot):
    return time_slot.hour * 60 + time_slot.minute

def prepare_data(room_id):
    bookings = list(booking_collection.find({"roomId": ObjectId(room_id)}))
    schedule = schedule_collection.find_one({"roomId": ObjectId(room_id)})
    if not bookings or not schedule:
        raise ValueError("No bookings or schedule found for the specified room_id")

    data = []
    day_template = schedule['dayTemplate']
    complete_schedule = schedule['completeSchedule']
    
    # Collect all slots from the complete schedule
    for day in complete_schedule:
        date = day['date']
        for slot in day['slots']:
            start_time = slot['start']
            end_time = slot['end']
            # Check if this slot is booked
            is_booked = any(
                booking['startTime'] == start_time and booking['endTime'] == end_time for booking in bookings
            )
            data.append({
                'startTime': start_time,
                'day_of_week': get_day_of_week(start_time),
                'time_slot_minutes': get_minutes_from_start_of_day(start_time),
                'booked': 1 if is_booked else 0
            })

    df = pd.DataFrame(data)
    df['day_of_week'] = df['startTime'].apply(lambda x: get_day_of_week(x))
    df['time_slot_minutes'] = df['startTime'].apply(lambda x: get_minutes_from_start_of_day(x))

    # Print the prepared data for inspection
    print("Prepared Data (First 10 Rows):")
    print(df.head(10))

    X = df[['day_of_week', 'time_slot_minutes']]
    y = df['booked']

    return X, y

def prepare_aggregate_data(room_id):
    bookings = list(booking_collection.find({"roomId": ObjectId(room_id)}))
    schedule = schedule_collection.find_one({"roomId": ObjectId(room_id)})
    if not bookings or not schedule:
        raise ValueError("No bookings or schedule found for the specified room_id")

    data = []
    day_template = schedule['dayTemplate']
    complete_schedule = schedule['completeSchedule']
    
    # Collect all slots from the complete schedule
    for day in complete_schedule:
        date = day['date']
        day_of_week = get_day_of_week(date)
        total_slots = len(day['slots'])
        booked_slots = sum(
            1 for slot in day['slots'] if any(
                booking['startTime'] == slot['start'] and booking['endTime'] == slot['end'] for booking in bookings
            )
        )
        data.append({
            'day_of_week': day_of_week,
            'total_slots': total_slots,
            'booked_slots': booked_slots
        })

    df = pd.DataFrame(data)
    df['occupied_percentage'] = df['booked_slots'] / df['total_slots'] * 100

    # Print the aggregate data for inspection
    print("Aggregate Data (First 10 Rows):")
    print(df.head(10))

    X = df[['day_of_week']]
    y = df['occupied_percentage']

    return X, y

@app.route('/train', methods=['POST'])
def train_models():
    global linear_model, logistic_model
    room_id = request.json.get('room_id')
    if not room_id:
        return jsonify({'error': 'room_id is required'}), 400
    
    try:
        # Train Logistic Regression Model
        X, y = prepare_data(room_id)
        
        # Print the shape and distribution of the prepared data
        print("Training Data Shape:", X.shape)
        print("Class Distribution:")
        print(y.value_counts())

        logistic_model = LogisticRegression()
        logistic_model.fit(X, y)
        save_model(logistic_model, 'logistic_model', room_id)

        # Train Linear Regression Model
        X_agg, y_agg = prepare_aggregate_data(room_id)
        
        # Print the shape and distribution of the aggregate data
        print("Aggregate Data Shape:", X_agg.shape)
        print("Aggregate Target Distribution:")
        print(y_agg.describe())

        linear_model = LinearRegression()
        linear_model.fit(X_agg, y_agg)
        save_model(linear_model, 'linear_model', room_id)
        
        return jsonify({'message': 'Models trained and saved successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/predict', methods=['GET'])
def predict():
    global linear_model, logistic_model
    room_id = request.args.get('room_id')
    if not room_id:
        return jsonify({'error': 'room_id is required'}), 400

    try:
        # Load models from the database
        logistic_model = load_model('logistic_model', room_id)
        linear_model = load_model('linear_model', room_id)
        
        if not logistic_model or not linear_model:
            return jsonify({'error': 'Models not trained or loaded'}), 400

        latest_booking_cursor = booking_collection.find({"roomId": ObjectId(room_id)}).sort("startTime", -1).limit(1)
        latest_booking = list(latest_booking_cursor)
        
        if not latest_booking:
            latest_date = datetime.now()
        else:
            latest_date = latest_booking[0]['startTime']
        
        schedule = schedule_collection.find_one({"roomId": ObjectId(room_id)})
        if not schedule:
            return jsonify({'error': 'No schedule found for the specified room_id'}), 400

        day_template = schedule['dayTemplate']
        slots = day_template['slots']

        predictions = []
        
        for day_offset in range(1, 8):
            current_date = latest_date + timedelta(days=day_offset)
            day_of_week = get_day_of_week(current_date)
            
            day_prediction = {'date': current_date.strftime('%Y-%m-%d'), 'slots': []}
            occupied_slots = 0
            total_slots = len(slots)
            for slot in slots:
                slot_start = datetime.combine(current_date.date(), slot['start'].time())
                time_slot_minutes = get_minutes_from_start_of_day(slot_start)
                
                # Create DataFrame with appropriate column names
                input_data = pd.DataFrame({
                    'day_of_week': [day_of_week],
                    'time_slot_minutes': [time_slot_minutes]
                })

                probability_of_booking = logistic_model.predict_proba(input_data)[0][1]
                if probability_of_booking > 0.5:  # Threshold for considering a slot as occupied
                    occupied_slots += 1
                day_prediction['slots'].append({
                    'time_slot': f"{slot['start'].strftime('%H:%M')}-{slot['end'].strftime('%H:%M')}",
                    'probability_of_booking': probability_of_booking
                })
            
            # Predict occupied percentage using linear regression model
            occupied_percentage = linear_model.predict(pd.DataFrame({'day_of_week': [day_of_week]}))[0]
            day_prediction['occupied_percentage'] = occupied_percentage
            predictions.append(day_prediction)

        return jsonify(predictions)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000)
