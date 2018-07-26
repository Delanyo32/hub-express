DELETE beneficiaries
DELETE volunteers
DELETE spending

POST beneficiaries/_search
POST volunteers/_search
POST spending/_search

PUT /beneficiaries
PUT /volunteers
PUT /spending

PUT /users

PUT beneficiaries/_mapping/beneficiaries
{
   "beneficiaries": {
      "properties": {
        "timestamp": {
          "type": "long"
        }
      }
   }
}

PUT volunteers/_mapping/volunteers
{
    "volunteers": {
        "properties": {
            "timestamp": {
                "type": "long"
            }
        }
    }
}

PUT spending/_mapping/spending
{
    "spending": {
        "properties": {
            "timestamp": {
                "type": "long"
            }
        }
    }
}


POST /beneficiaries/_search
{
    "query": {
        "match": {
            "projectId": "5aa986adcfb7372ba6f7e9c2"
        }
    },
    "aggs": {
        "beneficiaries_over_time": {
            "date_histogram": {
                "field": "timestamp",
                "interval": "day"
            }
        }
    }
}



