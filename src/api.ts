type ResponseCallback = (response: Response) => Promise<void>;
type ErrCallback = (reason: any) => void | PromiseLike<void>;

// XXX The JWT token should be aquired during runtime, not hard-coded here
const headers = {
    Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiNDc4Yzg1MjA2ODU4NWI4NTJiOGNjMGRlY2QyY2ExZiIsIm5iZiI6MTcyNzk0NzQ1Ny43ODMzNTQsInN1YiI6IjY2ZmU0OGQ3Zjg3OGFkZmVkMDg0ZDc0NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.WmupLXcsPz97-Svojjjisv99Rfll0GYtmMiPklVzzek",
};

interface AppApi {
    fetchDiscoverMovies: (
        discoverPage: number,
        success: ResponseCallback,
        err: ErrCallback
    ) => void;
    fetchMovieDetails: (id: string, success: ResponseCallback, err: ErrCallback) => void;
}

export const appApi: AppApi = {
    fetchDiscoverMovies: (discoverPage: number, success: ResponseCallback, err: ErrCallback) => {
        fetch(`https://api.themoviedb.org/3/discover/movie?page=${discoverPage}`, {
            headers,
        })
            .then(success)
            .catch(err);
    },
    fetchMovieDetails: (id: string, success: ResponseCallback, err: ErrCallback) => {
        if (id) {
            fetch(`https://api.themoviedb.org/3/movie/${id}`, {
                headers,
            })
                .then(success)
                .catch(err);
        }
    },
};
