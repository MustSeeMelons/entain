import { DiscoverMovieList } from "../../components/movie-list/discover-movie-list";
import { SearchMovieList } from "../../components/movie-list/search-movie-list";
import { Search } from "../../components/search/search";
import { getSearchMovies } from "../../selectors/global-selectors";
import { useAppSelector } from "../../store/store";
import styles from "./list-view.module.sass";

export const ListView = () => {
    const searchMovies = useAppSelector(getSearchMovies);

    const isSearchMode = searchMovies.length > 0;

    return (
        <div className={styles.list_view}>
            <Search />
            {isSearchMode ? <SearchMovieList /> : <DiscoverMovieList />}
        </div>
    );
};
