import {Mutation, Query} from "react-apollo";
import React, {Component} from 'react';
import {gql} from "apollo-boost";
import OrganisationEdit from "./organisationEdit";
import ErrorHandler from "../utils/errorHandler";
import QueryDefaultHandler from "../utils/queryDefaultHandler";

const ORGANISATION_BY_ID = gql`
  query organisationById($id: ID!) {
    organisationById(organisationId: $id) {
      id
      name
      addressLat
      addressLng
    }
  }
`;

const UPDATE_ORGANISATION = gql`
    mutation editOrganisation($id: ID!, $name: String!, $addressLat: String!, $addressLng: String!) {
     editOrganisation(id: $id, name: $name, addressLat: $addressLat, addressLng: $addressLng) {
      id
    }
  }
`;

class OrganisationEditMutation extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
        <Query fetchPolicy="no-cache" query={ORGANISATION_BY_ID}
               variables={{id: this.props.id}}>
          {({loading, error, data, refetch}) => {

            let result = new QueryDefaultHandler().handleGraphQlQuery(loading,
                error,
                data,
                data && data.organisationById);

            if(result){
              return result;
            }

            return (
                <Mutation mutation={UPDATE_ORGANISATION}

                          onError={(error) =>
                              new ErrorHandler().handleGraphQlMutationError(error)}

                          onCompleted={() => refetch()}>
                  {updateOrganisation => (

                      <OrganisationEdit organisation={data.organisationById}
                                        onSave={org =>
                                            updateOrganisation({
                                                  variables: {
                                                    id: this.props.id,
                                                    name: org.name,
                                                    addressLng: org.addressLng,
                                                    addressLat: org.addressLat
                                                  }
                                                }
                                            )}/>

                  )}
                </Mutation>
            );
          }}
        </Query>);
  }
}

export default OrganisationEditMutation;