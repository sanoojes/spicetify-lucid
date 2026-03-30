type GraphQLQuery = {
  name: string;
  sha256Hash: string;
};

export const makeRequest = async <T>(
  query: GraphQLQuery,
  variables: Record<string, unknown>,
  retries = 3,
  retryDelayMs = 1000
): Promise<T | null> => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await Spicetify.GraphQL.Request(
        { ...query, operation: 'query', value: null },
        variables
      );
      return response as T;
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('Unknown error');

      const isRetryable = error.message.includes('DUPLICATE_REQUEST_ERROR') && attempt < retries;

      if (isRetryable) {
        const delay = retryDelayMs * 2 ** attempt;
        console.warn(
          `Retrying ${query.name} (attempt ${attempt + 1}/${retries}) after ${delay}ms due to error: ${error.message}`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      console.error(`Error in ${query.name}:`, error);
      throw error;
    }
  }

  return null;
};
