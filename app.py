from dash import Dash, dcc, html, dash_table
import dash_leaflet as dl
import plotly.express as px
from dash.dependencies import Input, Output
import base64

import pandas as pd
import re  # needed for the regex pattern matching

from modules.animal_shelter import AnimalShelter

###########################
# Data Manipulation / Model
###########################
# Initialize AnimalShelter without credentials for local MongoDB
shelter = AnimalShelter()

# Load a sample of records to improve initial load time
df = pd.DataFrame.from_records(shelter.read({}, limit=100))

# Remove _id column to prevent DataTable crash
if '_id' in df.columns:
    df.drop(columns=['_id'], inplace=True)

#########################
# Dashboard Layout / View
#########################
app = Dash(__name__)

# Add in Grazioso Salvare's logo
try:
    image_filename = 'assets/grazioso-logo.png'
    encoded_image = base64.b64encode(open(image_filename, 'rb').read())
    logo_img = html.Img(src='data:image/png;base64,{}'.format(encoded_image.decode()), 
                       height=250, width=251)
except FileNotFoundError:
    print("Logo file not found - using placeholder")
    logo_img = html.Div("Logo Placeholder")

app.layout = html.Div([
    html.A([
        html.Center(logo_img)
    ], href='https://www.snhu.edu', target="_blank"),
    html.Center(html.B(html.H1("Animal Shelter Dashboard"))),
    html.Hr(),
    dcc.RadioItems(
        id='filter-type',
        options=[
            {'label': 'All', 'value': 'All'},
            {'label': 'Water Rescue', 'value': 'Water'},
            {'label': 'Mountain or Wilderness Rescue', 'value': 'Mountain'},
            {'label': 'Disaster Rescue or Individual Tracking', 'value': 'Disaster'},
        ],
        value='All'
    ),
    html.Hr(),
    dash_table.DataTable(
        id='datatable-id',
        columns=[{"name": i, "id": i, "deletable": False, "selectable": True} for i in df.columns],
        data=df.to_dict('records'),
        editable=True,
        row_selectable="single",
        selected_rows=[],
        filter_action="native",
        sort_action="native",
        page_action="native",
        page_current=0,
        page_size=10,
    ),
    html.Br(),
    html.Hr(),
    html.Div(
        className='row',
        style={'display': 'flex'},
        children=[
            html.Div(id='graph-id', className='col s12 m6'),
            html.Div(id='map-id', className='col s12 m6')
        ]
    )
])

#############################################
# Callbacks
#############################################

@app.callback(
    Output('datatable-id', 'data'),
    [Input('filter-type', 'value')]
)
def update_dashboard(filter_type):
    query = {}
    if filter_type == 'Water':
        query = {
            '$or': [
                {"breed": {'$regex': ".*lab.*", '$options': 'i'}},
                {"breed": {'$regex': ".*chesa.*", '$options': 'i'}},
                {"breed": {'$regex': ".*newf.*", '$options': 'i'}},
            ],
            "sex_upon_outcome": "Intact Female",
            "age_upon_outcome_in_weeks": {"$gte": 26.0, "$lte": 156.0}
        }
    elif filter_type == 'Mountain':
        query = {
            '$or': [
                {"breed": {'$regex': ".*german.*", '$options': 'i'}},
                {"breed": {'$regex': ".*mala.*", '$options': 'i'}},
                {"breed": {'$regex': ".*old english.*", '$options': 'i'}},
                {"breed": {'$regex': ".*husk.*", '$options': 'i'}},
                {"breed": {'$regex': ".*rott.*", '$options': 'i'}},
            ],
            "sex_upon_outcome": "Intact Male",
            "age_upon_outcome_in_weeks": {"$gte": 26.0, "$lte": 156.0}
        }
    elif filter_type == 'Disaster':
        query = {
            '$or': [
                {"breed": {'$regex': ".*german.*", '$options': 'i'}},
                {"breed": {'$regex': ".*golden.*", '$options': 'i'}},
                {"breed": {'$regex': ".*blood.*", '$options': 'i'}},
                {"breed": {'$regex': ".*dober.*", '$options': 'i'}},
                {"breed": {'$regex': ".*rott.*", '$options': 'i'}},
            ],
            "sex_upon_outcome": "Intact Male",
            "age_upon_outcome_in_weeks": {"$gte": 20.0, "$lte": 300.0}
        }
    
    df_filtered = pd.DataFrame.from_records(shelter.read(query, limit=100))
    if '_id' in df_filtered.columns:
        df_filtered.drop(columns=['_id'], inplace=True)
    return df_filtered.to_dict('records')

@app.callback(
    Output('datatable-id', 'style_data_conditional'),
    [Input('datatable-id', 'selected_columns')]
)
def update_styles(selected_columns):
    if not selected_columns:
        return []
    return [{
        'if': {'column_id': i},
        'background_color': '#D2F3FF'
    } for i in selected_columns]

@app.callback(
    Output('graph-id', "children"),
    [Input('datatable-id', "derived_virtual_data")]
)
def update_graphs(viewData):
    if not viewData:
        return []
    dffPie = pd.DataFrame.from_dict(viewData)
    return [
        dcc.Graph(            
            figure=px.pie(dffPie, names='breed', title='Preferred Animals')
        )    
    ]

@app.callback(
    Output('map-id', "children"),    
    [Input('datatable-id', "derived_virtual_data"), 
     Input('datatable-id', "derived_virtual_selected_rows")]
)
def update_map(viewData, index):
    # If no data, return empty map
    if not viewData:
        return [
            dl.Map(style={'width': '1000px', 'height': '500px'}, 
                  center=[30.75, -97.48], zoom=10,
                  children=[dl.TileLayer(id="base-layer-id")])
        ]
    
    dff = pd.DataFrame.from_dict(viewData)
    
    # If no row selected, show empty map centered on Austin
    if not index:
        return [
            dl.Map(style={'width': '1000px', 'height': '500px'}, 
                  center=[30.75, -97.48], zoom=10,
                  children=[dl.TileLayer(id="base-layer-id")])
        ]
    
    row = index[0]
    
    try:
        # Get coordinates using the correct column names
        lat = float(dff.iloc[row, dff.columns.get_loc('location_lat')])
        lon = float(dff.iloc[row, dff.columns.get_loc('location_long')])
        breed = dff.iloc[row, dff.columns.get_loc('breed')]
        name = dff.iloc[row, dff.columns.get_loc('name')]
        
        return [
            dl.Map(
                style={'width': '1000px', 'height': '500px'}, 
                center=[30.75, -97.48], 
                zoom=10, 
                children=[
                    dl.TileLayer(id="base-layer-id"),
                    dl.Marker(
                        position=[lat, lon], 
                        children=[
                            dl.Tooltip(breed),
                            dl.Popup([
                                html.H1("Animal Name"),
                                html.P(name)
                            ])
                        ]
                    )
                ]
            )
        ]
    except Exception as e:
        print(f"Error updating map: {e}")
        # Return empty map if there's an error
        return [
            dl.Map(style={'width': '1000px', 'height': '500px'}, 
                  center=[30.75, -97.48], zoom=10,
                  children=[dl.TileLayer(id="base-layer-id")])
        ]

if __name__ == '__main__':
    app.run_server(debug=True)