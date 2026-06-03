import { gql } from 'apollo-angular';

export const GET_CHARACTERS = gql`
  query GetCharacters($page: Int, $name: String, $status: String) {
    characters(page: $page, filter: { name: $name, status: $status }) {
      info {
        count
        pages
        next
        prev
      }
      results {
        id
        name
        status
        species
        type
        gender
        image
        origin {
          id
          name
        }
        location {
          id
          name
        }
        episode {
          id
        }
      }
    }
  }
`;
