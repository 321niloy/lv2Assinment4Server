import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  public Modelquery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(Modelquery: Query<T[], T>, query: Record<string, unknown>) {
    (this.Modelquery = Modelquery), (this.query = query);
  }

  search(searchableFields: string[]) {
    const searchTerm = this?.query?.searchTerm;
    if (searchTerm) {
      this.Modelquery = this.Modelquery.find({
        $or: searchableFields.map(
          field =>
            ({
              [field]: { $regex: searchTerm, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      });
    }
    return this;
  }

  filter() {
    const queryObj = { ...this.query };

    const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
    excludeFields.forEach(el => delete queryObj[el]);

    this.Modelquery = this.Modelquery.find(queryObj as FilterQuery<T>);

    return this;
  }

  sort() {
    const sort =
      (this?.query?.sort as string)?.split(',')?.join(' ') || '-createdAt';
    // const sort = this?.query?.sort || '-createdAt';
    this.Modelquery = this.Modelquery.sort(sort as string);

    return this;
  }

  pagination() {
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const skip = (page - 1) * limit;

    this.Modelquery = this.Modelquery.skip(skip).limit(limit);
    return this;
  }

  fields() {
    const fields =
      (this?.query?.fields as string)?.split(',')?.join(' ') || '-__v';

    this.Modelquery = this.Modelquery.select(fields);

    return this;
  }

  async countTotal() {
    const totalQueries = this.Modelquery.getFilter();
    const total = await this.Modelquery.model.countDocuments(totalQueries);
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const totalPage = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPage,
    };
  }
}

export default QueryBuilder;
