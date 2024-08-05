import pandas as pd
import requests
from datetime import datetime
import json

# define function to transform the data received from the OData call into
# a pandas DataFrame for ease of use
def get_request_to_dataframe(response_content):
    # loads the bytes received from the GET request into JSON format
    content = json.loads(response_content.content)

    # extracts the data from the previous content variable
    data = content['value']

    # the appropriate column names are extracted from the original DataFrame
    # add some error handling for if there is no data
    columns = list(data[0].keys())

    # extracts the values from the key-value pairs of the dictionaries
    # in the input dataframe
    row_values = [elem.values() for elem in data]

    # all values per row are added as lists to a list
    unpacked_row_values = [list(item)[0:len(columns)] for item in row_values]

    # the list of lists of the previous step is converted to a DataFrame

    final_df = pd.DataFrame(unpacked_row_values)


    # column names are assigned to the DataFrame
    final_df.columns = columns

    # length check of rows. If the length of (a) row(s) exceeds the amount of
    # columns in the data. An error message is thrown identifying the number
    # and location of the problematic rows
    counter = 0
    row_index = []

    for i, elem in enumerate(unpacked_row_values):
        if len(elem) > len(columns):
            row_index.append(i)
            counter += 1

    if counter > 0:
        print(f'{counter} rows in the dataframe have a length greater than',
              ' the number of identified columns.', 'The index positions ',
              f'are: {row_index}')

    # returns final dataframe to caller
    return final_df


# set the appropriate URL, change this when you want to query different models or entities. Or if
# you want to change the query result set
url = 'https://dataservices.wecr.wur.nl/odata/public/UNComtrade/Reporter?$select=ID,Name'

# set some date and time variables
now = datetime.now()

dt_string = now.strftime('%Y.%m.%d %H:%M:%S')

d_string = now.strftime('%Y.%m.%d')

t_string = now.strftime('%H:%M:%S')

# send a GET request to the OData API endpoint
response = requests.get(url)

# identify to the user if the GET request was succesful
if response.status_code == 200:
    print(f'GET request succeeded at {t_string}')
else:
    print('Failed: ', response.status_code)

# use the get_request_to_dataframe function to parse the GET request
parsed_df = get_request_to_dataframe(response)



